// Dev helper: slices a full-page screenshot into viewable chunks.
import sharp from "sharp";
const [src, outPrefix, chunk = "1800", scale = "0.6"] = process.argv.slice(2);
const m = await sharp(src).metadata();
const n = Math.ceil(m.height / +chunk);
for (let i = 0; i < n; i++) {
  const h = Math.min(+chunk, m.height - i * +chunk);
  await sharp(src).extract({ left: 0, top: i * +chunk, width: m.width, height: h }).resize(Math.round(m.width * +scale)).jpeg({ quality: 80 }).toFile(`${outPrefix}-${i}.jpg`);
}
console.log(m.width, m.height, n);
