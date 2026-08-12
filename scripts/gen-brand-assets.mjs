// One-off: regenerate favicon + OG image from the MI Infotech logo.
import sharp from 'sharp';
import path from 'node:path';

const logo = path.resolve('src/images/mainfotech.png');
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// ── Square app/favicon icon (white bg, logo contained with padding) ──────────
async function makeIcon(size, out) {
  const pad = Math.round(size * 0.12);
  const inner = size - pad * 2;
  const fg = await sharp(logo)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: WHITE },
  })
    .composite([{ input: fg, gravity: 'center' }])
    .png()
    .toFile(path.resolve(out));
  console.log('wrote', out);
}

// ── OG / social share image (1200x630, white bg, centered logo) ──────────────
async function makeOg(out) {
  const W = 1200;
  const H = 630;
  const fg = await sharp(logo)
    .resize(760, 430, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({
    create: { width: W, height: H, channels: 4, background: WHITE },
  })
    .composite([{ input: fg, gravity: 'center' }])
    .png()
    .toFile(path.resolve(out));
  console.log('wrote', out);
}

await makeIcon(512, 'src/images/icon.png');
await makeOg('src/images/social.png');
