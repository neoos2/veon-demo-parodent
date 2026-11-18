// One-off: crops and converts client photos (downloaded to .raw-img/) into public/img/*.webp
import sharp from "sharp";
const R = ".raw-img/", O = "public/img/";
// [src, out name, crop ratio w/h, focal x (0..1), focal y (0..1), widths]
const jobs = [
  ["dsc_3036-scaled-e1610636528467.jpg", "shevchenka", 3/4, .47, .5, [360, 720]],
  ["dsc_3004-2-scaled-e1610616403903.jpg", "lychakivska", 3/4, .5, .55, [360, 720]],
  ["dsc_3029-scaled.jpg", "hlyboka", 3/4, .40, .5, [360, 720]],
  ["dsc_3023-scaled.jpg", "skoryka", 3/4, .42, .5, [360, 720]],
  ["img_0084-1.jpg", "chervonoi-kalyny", 3/4, .5, .44, [360, 720]],
  // hero street: tighter square crops so the flags over the entrances read at ~300 px
  ["dsc_3036-scaled-e1610636528467.jpg", "street-shevchenka", 1, .47, .42, [400, 800], .62],
  ["dsc_3004-2-scaled-e1610616403903.jpg", "street-lychakivska", 1, .4, .42, [400, 800], .78],
  ["dsc_3029-scaled.jpg", "street-hlyboka", 1, .36, .55, [400, 800], .85],
  ["dsc_3023-scaled.jpg", "street-skoryka", 1, .56, .5, [400, 800], .72],
  ["img_0084-1.jpg", "street-chervonoi-kalyny", 1, .5, .47, [400, 800], .85],
  ["dsc_7346-scaled.jpg", "implant-tray-sharp", 4/5, .4, .72, [520, 900], .55],
  ["dsc_3036-scaled-e1610636528467.jpg", "flags", 16/10, .5, .4, [640, 960], .75],
  ["dsc_7346-scaled.jpg", "implant-tray", 4/5, .55, .5, [520, 900]],
  ["dsc_7373-scaled.jpg", "surgery", 3/2, .5, .5, [640, 1100]],
  ["img_8549-scaled.jpg", "warsaw", 4/3, .5, .5, [480, 900]],
];
for (const [src, name, ratio, fx, fy, widths, scale = 1] of jobs) {
  const img = sharp(R + src).rotate();
  const { width: W, height: H } = await img.metadata();
  let cw = W, ch = Math.round(W / ratio);
  if (ch > H) { ch = H; cw = Math.round(H * ratio); }
  cw = Math.round(cw * scale); ch = Math.round(ch * scale);
  const left = Math.max(0, Math.min(W - cw, Math.round(fx * W - cw / 2)));
  const top = Math.max(0, Math.min(H - ch, Math.round(fy * H - ch / 2)));
  for (const w of widths) {
    const out = `${O}${name}-${w}.webp`;
    const info = await sharp(R + src).rotate().extract({ left, top, width: cw, height: ch })
      .resize(w).modulate({ saturation: 1.02 }).webp({ quality: 74 }).toFile(out);
    console.log(out, info.width, info.height, info.size);
  }
}
await sharp(R + "1.png").trim({ threshold: 10 }).unflatten().webp({ quality: 92, alphaQuality: 100 }).toFile(O + "logo.webp");
await sharp(R + "1.png").extract({ left: 106, top: 0, width: 80, height: 70 }).resize(180, 180, { fit: "contain", background: "#FBF7F5" }).png().toFile("public/favicon.png");
console.log("logo+favicon ok");
