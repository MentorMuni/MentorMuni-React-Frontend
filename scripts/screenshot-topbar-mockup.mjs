import puppeteer from 'puppeteer';

const out = '/Users/rahul/Downloads/MentorMuni/MentorMuniAPI/screenshots/tpo-topbar-proposed-layout.png';
const html = 'file:///Users/rahul/Downloads/MentorMuni/MentorMuniAPI/screenshots/tpo-topbar-mockup.html';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 520 });
await page.goto(html, { waitUntil: 'networkidle0' });
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
