import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

// Suppress popup by setting sessionStorage before navigation
await page.evaluateOnNewDocument(() => {
  sessionStorage.setItem('mm_popup_seen', '1');
});

await page.goto('http://localhost:5176/MentorMuni-React-Frontend/#/', {
  waitUntil: 'networkidle0', timeout: 30000,
});

// Scroll through entire page to trigger IntersectionObserver
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 600;
for (let y = 0; y < pageHeight; y += step) {
  await page.evaluate(pos => window.scrollTo(0, pos), y);
  await new Promise(r => setTimeout(r, 120));
}
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 800));

// Force any still-hidden elements visible (for elements that may have missed observer)
await page.evaluate(() => {
  document.querySelectorAll('*').forEach(el => {
    const s = window.getComputedStyle(el);
    if (s.opacity === '0' && el.style.opacity === '0') {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });
});
await new Promise(r => setTimeout(r, 400));

const outPath = path.join(__dirname, 'homepage-full.png');
await page.screenshot({ path: outPath, fullPage: true });

console.log('Screenshot saved to:', outPath);
await browser.close();
