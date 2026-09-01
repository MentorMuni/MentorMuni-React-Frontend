import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', '..', 'MentorMuni', 'MentorMuniAPI', 'screenshots');
const baseUrl = 'http://localhost:5173';

const demoSession = {
  id: 'demo_tpo_tpo',
  name: 'Demo TPO',
  email: 'tpo@demo.edu',
  username: 'tpo',
  role: 'TPO',
  role_code: '',
  dept_admin_title: '',
  role_label: '',
  organization_id: 'demo-org',
  organization_name: 'Indore Public School',
  organization_code: 'DEMO',
  department_id: null,
  department_name: '',
  department_code: '',
  permissions: [],
  hodAccess: null,
  mustChangePassword: false,
  demo: true,
  loggedInAt: new Date().toISOString(),
};

async function seedDemoSession(page) {
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((session) => {
    sessionStorage.setItem('mm-org-token', 'demo.TPO.preview');
    sessionStorage.setItem('mm-org-session', JSON.stringify(session));
    localStorage.setItem('mm-org-college-code', 'DEMO');
  }, demoSession);
}

async function waitForShell(page) {
  await page.goto(`${baseUrl}/Organization/dashboard`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.mm-org-account', { timeout: 30000 });
  await page.waitForSelector('.mm-org-account__actions', { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
}

async function capture() {
  await mkdir(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  try {
    await seedDemoSession(page);
    await waitForShell(page);

    const fullPath = path.join(outDir, 'tpo-portal-topbar-layout.png');
    await page.screenshot({ path: fullPath, fullPage: false });

    const account = await page.$('.mm-org-account');
    if (account) {
      await account.screenshot({
        path: path.join(outDir, 'tpo-portal-topbar-right-closeup.png'),
      });
    }

    const topbar = await page.$('.mm-org-topbar');
    if (topbar) {
      await topbar.screenshot({
        path: path.join(outDir, 'tpo-portal-topbar-full.png'),
      });
    }

    console.log(JSON.stringify({ ok: true, outDir, fullPath }));
  } finally {
    await browser.close();
  }
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
