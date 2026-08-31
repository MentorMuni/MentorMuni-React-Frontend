import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'public/hod-performance-preview.html');
const outPath = path.join(root, 'public/hod-performance-preview.png');
const tpoOutPath = path.join(root, 'public/performance-dashboard-preview.png');

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outPath, fullPage: true });
console.log('HOD preview:', outPath);

// Refresh TPO preview screenshot too
const tpoHtml = path.join(root, 'public/performance-dashboard-preview.html');
await page.goto(`file://${tpoHtml}`, { waitUntil: 'networkidle0' });
await page.screenshot({ path: tpoOutPath, fullPage: true });
console.log('TPO preview:', tpoOutPath);

await browser.close();
