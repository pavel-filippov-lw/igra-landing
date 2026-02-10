import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Set viewport to desktop size
await page.setViewportSize({ width: 1440, height: 900 });

// Navigate to the local development server
await page.goto('http://localhost:5173/');

// Wait for the page to load
await page.waitForTimeout(3000);

// Get the total scrollable height
const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
console.log('Total scrollable height:', scrollHeight);

// Scroll down in steps and take screenshots
const scrollStep = 800;
let currentScroll = 0;
let screenshotIndex = 0;

while (currentScroll < scrollHeight) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), currentScroll);
  await page.waitForTimeout(500);

  await page.screenshot({ path: `scroll-capture-${screenshotIndex}.png` });
  console.log(`Screenshot ${screenshotIndex} at scroll position ${currentScroll}`);

  currentScroll += scrollStep;
  screenshotIndex++;
}

console.log(`Captured ${screenshotIndex} screenshots`);

await browser.close();