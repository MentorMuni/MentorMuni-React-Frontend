import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE = 'http://localhost:5173';
const OUT = '/Users/rahul/Downloads/Frontend/tmp/demo-shots';
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const HIDE_CSS = `
  .mm-org-login__demo, .mm-student-login__demo, .mm-announcement-bar { display: none !important; }
  *, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important;
    transition-duration: 0s !important; transition-delay: 0s !important; }
`;

async function shot(page, name, opts = {}) {
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  await sleep(opts.wait ?? 1600);
  const file = `${OUT}/${name}.png`;
  await page.screenshot({ path: file, fullPage: !!opts.full });
  console.log('SHOT', name, opts.full ? '(full)' : '');
}

async function go(page, path, name, opts = {}) {
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 45000 });
  } catch (e) { console.log('NAV-SLOW', path, e.message.slice(0, 60)); }
  await sleep(opts.settle ?? 2200);
  await shot(page, name, opts);
}

const browser = await puppeteer.launch({
  headless: 'new',
  defaultViewport: { width: 1512, height: 945, deviceScaleFactor: 2 },
  args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
});

/* ───────── ORG PORTAL (TPO) ───────── */
const org = await browser.newPage();
await org.goto(`${BASE}/Organization/login`, { waitUntil: 'networkidle2' });
await sleep(2500);
await shot(org, '01-org-login-college-picker');

// step 1: pick DEMO college
await org.type('input[type="search"]', 'Demo', { delay: 40 });
await sleep(1200);
await org.evaluate(() => {
  const btns = [...document.querySelectorAll('.mm-org-college-list button')];
  (btns[0] || {}).click?.();
});
await sleep(600);
await org.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => /continue to sign-in/i.test(x.textContent));
  b?.click();
});
await sleep(1800);
await shot(org, '02-org-login-signin');

// fill demo TPO + submit
await org.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => /fill tpo demo/i.test(x.textContent));
  b?.click();
});
await sleep(800);
await org.evaluate(() => {
  const b = document.querySelector('.mm-org-login__submit');
  b?.click();
});
await sleep(5000);
console.log('ORG URL after login:', org.url());

const tpoRoutes = [
  ['/Organization/dashboard',       '10-tpo-dashboard'],
  ['/Organization/departments',     '11-tpo-departments'],
  ['/Organization/enrollment',      '12-tpo-enrollment'],
  ['/Organization/students',        '13-tpo-students'],
  ['/Organization/programs',        '14-tpo-programs'],
  ['/Organization/drives',          '15-tpo-drives'],
  ['/Organization/upcoming-drives', '16-tpo-upcoming-drives'],
  ['/Organization/performance',     '17-tpo-performance'],
  ['/Organization/access',          '18-tpo-access'],
  ['/Organization/workspace',       '19-tpo-workspace'],
  ['/Organization/notify',          '20-tpo-notify'],
  ['/Organization/settings',        '21-tpo-settings'],
  ['/Organization/help',            '22-tpo-help'],
];
for (const [p, n] of tpoRoutes) await go(org, p, n);
for (const [p, n] of [['/Organization/dashboard','10b-tpo-dashboard-full'],['/Organization/performance','17b-tpo-performance-full']])
  await go(org, p, n, { full: true });
await org.close();

/* ───────── ORG PORTAL (HOD) ───────── */
const hod = await browser.newPage();
await hod.goto(`${BASE}/Organization/login`, { waitUntil: 'networkidle2' });
await sleep(2500);
await hod.type('input[type="search"]', 'Demo', { delay: 40 });
await sleep(1200);
await hod.evaluate(() => { [...document.querySelectorAll('.mm-org-college-list button')][0]?.click(); });
await sleep(600);
await hod.evaluate(() => {
  [...document.querySelectorAll('button')].find(x => /continue to sign-in/i.test(x.textContent))?.click();
});
await sleep(1800);
await hod.evaluate(() => {
  [...document.querySelectorAll('button[role="tab"]')].find(x => /hod/i.test(x.textContent))?.click();
});
await sleep(700);
await hod.evaluate(() => {
  [...document.querySelectorAll('button')].find(x => /fill hod demo/i.test(x.textContent))?.click();
});
await sleep(800);
await hod.evaluate(() => { document.querySelector('.mm-org-login__submit')?.click(); });
await sleep(5000);
console.log('HOD URL after login:', hod.url());

for (const [p, n] of [
  ['/Organization/dashboard', '30-hod-dashboard'],
  ['/Organization/students',  '31-hod-students'],
  ['/Organization/notify',    '32-hod-notify'],
  ['/Organization/workspace', '33-hod-workspace'],
  ['/Organization/performance','34-hod-performance'],
]) await go(hod, p, n);
await hod.close();

/* ───────── STUDENT PORTAL ───────── */
const stu = await browser.newPage();
await stu.goto(`${BASE}/studentportal/login`, { waitUntil: 'networkidle2' });
await sleep(2500);
await shot(stu, '40-student-login');

await stu.goto(`${BASE}/studentportal/home?seed=full`, { waitUntil: 'networkidle2' });
await sleep(6000);
console.log('STUDENT URL after seed:', stu.url());

for (const [p, n] of [
  ['/studentportal/home',            '41-student-home'],
  ['/studentportal/fear-to-fearless','42-student-fear-to-fearless'],
  ['/studentportal/practice',        '43-student-practice'],
  ['/studentportal/coding',          '44-student-coding'],
  ['/studentportal/company-prep',    '45-student-company-prep'],
  ['/studentportal/companies',       '46-student-companies'],
  ['/studentportal/progress',        '47-student-progress'],
  ['/studentportal/mentor',          '48-student-mentor'],
  ['/studentportal/whiteboard',      '49-student-whiteboard'],
  ['/studentportal/profile',         '50-student-profile'],
]) await go(stu, p, n);
await go(stu, '/studentportal/home', '41b-student-home-full', { full: true });
await stu.close();

/* ───────── PLATFORM ADMIN (login page only) ───────── */
const pa = await browser.newPage();
await pa.goto(`${BASE}/platform/admin/login`, { waitUntil: 'networkidle2' });
await sleep(2500);
await shot(pa, '60-platform-admin-login');
await pa.close();

/* ───────── MARKETING: colleges page ───────── */
const mk = await browser.newPage();
await go(mk, '/colleges', '70-marketing-colleges');
await go(mk, '/', '71-marketing-home');
await mk.close();

await browser.close();
console.log('DONE');
