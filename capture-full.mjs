import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Set viewport to desktop size
await page.setViewportSize({ width: 1440, height: 900 });

// Navigate to the local development server
await page.goto('http://localhost:5173/');

// Wait for the page to load
await page.waitForTimeout(5000);

// Take a full page screenshot
await page.screenshot({ path: 'full-page-complete.png', fullPage: true });

console.log('Full page screenshot saved as full-page-complete.png');

await browser.close();