import sharp from "sharp";
import fs from "node:fs";
const dir = process.argv[2], out = process.argv[3];
const files = fs.readdirSync(dir).filter(f=>/\.(jpe?g|png)$/.test(f));
const tiles = await Promise.all(files.map(async f => ({ input: await sharp(`${dir}/${f}`).resize(400,400,{fit:"contain",background:"#888"}).toBuffer() })));
const cols=3, rows=Math.ceil(tiles.length/cols);
await sharp({create:{width:cols*400,height:rows*400,channels:3,background:"#fff"}}).composite(tiles.map((t,i)=>({...t,left:(i%cols)*400,top:Math.floor(i/cols)*400}))).jpeg().toFile(out);
console.log(files);
