// Scroll hooks. Content stays visible without JS and with prefers-reduced-motion.
// [data-grow] / [data-reveal]: gets .is-visible once on entering the viewport (guarantee bars).
// #hero: while it is on screen, <html> keeps .at-hero (mobile bottom call bar waits below the screen).
// Mobile menu (<details>) closes after an anchor is chosen.
const root = document.documentElement;
const items = document.querySelectorAll<HTMLElement>("[data-grow], [data-reveal]");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce || !("IntersectionObserver" in window)) {
  items.forEach((el) => el.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.2 });
  items.forEach((el) => io.observe(el));
}

const hero = document.getElementById("hero");
if (hero && "IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => root.classList.toggle("at-hero", e.isIntersecting), { threshold: 0 }).observe(hero);
} else {
  root.classList.remove("at-hero");
}

const menu = document.querySelector<HTMLDetailsElement>(".m-menu");
menu?.querySelectorAll("a[href^='#']").forEach((a) => a.addEventListener("click", () => { menu.open = false; }));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu?.open) { menu.open = false; menu.querySelector("summary")?.focus(); }
});
