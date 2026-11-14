// Renders the social share image and icon PNGs from HTML/SVG using headless Chrome.
// Usage: node scripts/generate-brand-assets.mjs   (re-run after changing the mark or colours)
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const font = (p) => readFileSync(p).toString('base64');
const manrope = font('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2');
const inter = font('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');

const mark = (light = '#F6F7F9', gold = '#C9A76D') => `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g transform="skewY(-14) translate(0 6)">
<rect x="15" y="2" width="11" height="7" rx="1" fill="${light}"/><rect x="15" y="11" width="22" height="11" rx="1" fill="${gold}"/>
<rect x="2" y="15" width="11" height="9" rx="1" fill="${light}"/><rect x="15" y="24" width="11" height="7" rx="1" fill="${light}"/></g></svg>`;

const css = `
@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${manrope}) format('woff2');font-weight:200 800}
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter}) format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}body{background:#0B1422}`;

const og = `<!doctype html><html><head><style>${css}
.og{width:1200px;height:630px;background:#0B1422;color:#F6F7F9;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;font-family:Inter}
.brand{display:flex;align-items:center;gap:18px;font-family:Manrope;font-weight:700;font-size:40px;letter-spacing:-0.03em}
.brand svg{width:56px;height:56px}
h1{font-family:Manrope;font-weight:800;font-size:84px;line-height:1.04;letter-spacing:-0.03em;max-width:820px}
.foot{display:flex;justify-content:space-between;align-items:flex-end;font-size:26px;color:#AAB6C6}
.rule{width:96px;height:4px;background:#C9A76D;margin-bottom:28px}
.lines{position:absolute;right:-40px;bottom:0;width:560px;height:630px;opacity:.85}
</style></head><body><div class="og">
<svg class="lines" viewBox="0 0 600 400" preserveAspectRatio="xMaxYMax slice"><defs><linearGradient id="f" x1="0" x2="1"><stop offset="0" stop-color="#C9A76D" stop-opacity="0"/><stop offset="1" stop-color="#C9A76D" stop-opacity=".6"/></linearGradient></defs>
<g stroke="url(#f)" fill="none"><path d="M220 400V170h40v230M280 400V110h56v290M356 400V60h44v340M420 400V140h60v260M500 400V90h36v310M556 400V190h44v210"/></g></svg>
<div class="brand">${mark()}<span>Fund’ex</span></div>
<div><div class="rule"></div><h1>Where strategy meets execution.</h1></div>
<div class="foot"><span>Fundex Global · Melbourne, Australia</span><span>fundexglobal.vc</span></div>
</div></body></html>`;

const icon = (size, pad) => `<!doctype html><html><head><style>${css}
.i{width:${size}px;height:${size}px;background:#0B1422;display:grid;place-items:center}
.i svg{width:${size - pad * 2}px;height:${size - pad * 2}px}</style></head><body><div class="i">${mark()}</div></body></html>`;

mkdirSync('public/og', { recursive: true });
mkdirSync('public/brand', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ deviceScaleFactor: 1 });

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(og, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og/fundex-global.png', type: 'png' });

for (const [size, pad, out] of [
  [180, 26, 'public/apple-touch-icon.png'],
  [192, 28, 'public/brand/icon-192.png'],
  [512, 72, 'public/brand/icon-512.png'],
  [512, 40, 'public/brand/fundex-mark.png'],
  [32, 3, 'scripts/.favicon-32.png'],
]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(icon(size, pad), { waitUntil: 'load' });
  await page.screenshot({ path: out, type: 'png' });
}
await browser.close();

// Wrap the 32px PNG in an ICO container (ICO files may embed PNG data directly).
const png = readFileSync('scripts/.favicon-32.png');
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png.length, 14); // size
header.writeUInt32LE(22, 18); // offset
writeFileSync('public/favicon.ico', Buffer.concat([header, png]));
console.log('brand assets written');
