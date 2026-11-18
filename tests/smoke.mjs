// Smoke/e2e check of the demo home: widths 320–1440, no horizontal scroll, key elements inside the screen,
// mobile menu, bottom bar after the first screen, FutureLink note, anchors, reduced motion, no-JS content.
// Usage: node tests/smoke.mjs http://localhost:4321/ [outdir]   (Playwright from ~/.veon/tools)
import { createRequire } from "node:module";
import os from "node:os";
const require = createRequire(os.homedir() + "/.veon/tools/package.json");
const { chromium } = require("playwright");
const url = process.argv[2] || "http://localhost:4321/";
const out = process.argv[3];
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "PASS" : "FAIL"} ${m}`); if (!c) fails++; };

for (const w of [320, 375, 390, 768, 1024, 1280, 1440]) {
  const p = await browser.newPage({ viewport: { width: w, height: w < 768 ? 844 : (w === 1280 ? 800 : 900) } });
  await p.goto(url, { waitUntil: "networkidle" });
  const r = await p.evaluate(() => {
    const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll("body *")].filter((el) => {
      if (el.closest(".future-link__note, .visually-hidden, .m-menu__panel")) return false;
      const b = el.getBoundingClientRect();
      return b.width && (b.right > cw + 1 || b.left < -1);
    }).map((el) => String(el.className || el.tagName)).slice(0, 5);
    const book = document.querySelector(".hero__book")?.getBoundingClientRect();
    const h1 = document.querySelector("h1");
    const hb = h1.getBoundingClientRect();
    return { sw, cw, wide, bookBottom: book?.bottom, vh: innerHeight, h1Lines: Math.round(hb.height / parseFloat(getComputedStyle(h1).lineHeight)) };
  });
  ok(r.sw <= r.cw, `${w}px no horizontal scroll (${r.sw}/${r.cw})`);
  ok(!r.wide.length, `${w}px nothing outside the screen ${r.wide.join(",")}`);
  ok(r.bookBottom && r.bookBottom <= r.vh, `${w}px «Записатися» in first screen (bottom ${Math.round(r.bookBottom)} of ${r.vh}), H1 lines ${r.h1Lines}`);
  if (out) await p.screenshot({ path: `${out}/fold-${w}.png` });

  if (w === 390) {
    const barHidden = await p.$eval(".bbar", (el) => getComputedStyle(el).visibility);
    ok(barHidden === "hidden", "390 bottom bar hidden on first screen");
    await p.evaluate(() => window.scrollTo(0, 2500)); await p.waitForTimeout(700);
    const bar = await p.$eval(".bbar", (el) => ({ v: getComputedStyle(el).visibility, b: el.getBoundingClientRect().bottom }));
    ok(bar.v === "visible" && bar.b <= 845, "390 bottom bar visible after first screen");
    if (out) await p.screenshot({ path: `${out}/m390-bar.png` });
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(700);
    const gap = await p.evaluate(() => document.querySelector(".bbar").getBoundingClientRect().top - document.querySelector(".site-footer__copy").getBoundingClientRect().bottom);
    ok(gap >= 0, `390 bottom bar does not cover the footer (gap ${Math.round(gap)} px)`);
    const calls = await p.$$eval("#clinics a[href^='tel:']", (as) => as.map((a) => a.getAttribute("href")));
    ok(calls.length === 5 && calls.every((h) => h === "tel:+380670002187"), `clinic «Подзвонити» → tel:+380670002187 (${calls.length})`);
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
    await p.click(".m-menu summary");
    ok(await p.$eval(".m-menu", (d) => d.open), "390 menu opens");
    if (out) await p.screenshot({ path: `${out}/m390-menu.png` });
    await p.click(".m-menu__list a[href='#prices']"); await p.waitForTimeout(1000);
    ok(!(await p.$eval(".m-menu", (d) => d.open)), "390 menu closes after anchor");
  }
  if (w === 1440) {
    await p.hover(".main-nav .future-link"); await p.waitForTimeout(400);
    const op = await p.$eval(".main-nav .future-link__note", (n) => getComputedStyle(n).opacity);
    ok(op === "1", "1440 FutureLink note on hover");
    await p.click(".main-nav a[href='#clinics']"); await p.waitForTimeout(1500);
    const top = await p.$eval("#clinics h2", (h) => h.getBoundingClientRect().top);
    ok(top > 72 && top < 300, `1440 anchor #clinics below sticky header (h2 top ${Math.round(top)})`);
    await p.evaluate(() => document.querySelector("#trust .scale").scrollIntoView({ block: "center" })); await p.waitForTimeout(1800);
    const tr = await p.$eval(".bar--key .bar__fill", (e) => getComputedStyle(e).transform);
    ok(tr === "none" || tr === "matrix(1, 0, 0, 1, 0, 0)", `guarantee bars grown (${tr})`);
  }
  await p.close();
}

{
  const p = await browser.newPage();
  await p.goto(url, { waitUntil: "networkidle" });
  const hrefs = await p.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  const allowed = /^#|^tel:\+380670002187$|^tel:\+380443344100$|^https:\/\/(t\.me\/parodentlviv|wa\.me\/380670002187|www\.instagram\.com\/parodent\.lviv|www\.facebook\.com\/parodent\.dentistry|www\.tiktok\.com\/@parodent|www\.youtube\.com\/channel\/UCmIJgFjJJ5_uuzxrVbsAF8Q|www\.google\.com\/maps\/search\/)/;
  const bad = hrefs.filter((h) => !allowed.test(h));
  ok(!bad.length, `links whitelist (${hrefs.length} links) ${bad.join(" ")}`);
  const ids = new Set(await p.$$eval("[id]", (e) => e.map((x) => x.id)));
  const deadAnchors = hrefs.filter((h) => h.startsWith("#") && !ids.has(h.slice(1)));
  ok(!deadAnchors.length, `anchors resolve ${deadAnchors.join(" ")}`);
  const html = await p.content();
  ok(!/parodent\.com\.ua/.test(html), "no parodent.com.ua anywhere");
  ok((await p.$$("h1")).length === 1, "one H1");
  ok(await p.$eval("h1", (h) => h.textContent.trim() === "Стоматологія Пародент у Львові — п’ять клінік повного циклу"), "H1 text = veon-concept");
  const sec = await p.$$eval("main > section", (s) => s.map((x) => x.id).join(","));
  ok(sec === "hero,services,clinics,prices,trust,abroad,for-dentists,contacts", `section ids ${sec}`);
  await p.close();
}

{
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); await p.goto(url, { waitUntil: "networkidle" });
  const cp = await p.$eval(".facade__frame", (e) => getComputedStyle(e).animationName + "|" + getComputedStyle(e).clipPath);
  ok(/^none\|none$/.test(cp), `reduced motion: facades static (${cp})`);
  const ctx2 = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const q = await ctx2.newPage(); await q.goto(url, { waitUntil: "networkidle" });
  const vis = await q.$eval(".bar--key .bar__fill", (e) => getComputedStyle(e).transform);
  ok(vis === "none" || vis.startsWith("matrix(1, 0, 0, 1"), `no JS: bars visible (${vis})`);
  if (out) await q.screenshot({ path: `${out}/nojs-390.png` });
  await ctx.close(); await ctx2.close();
}
await browser.close();
console.log(fails ? `RESULT: FAIL (${fails})` : "RESULT: PASS");
process.exit(fails ? 1 : 0);
