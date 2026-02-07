import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Capture at different viewport sizes
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 402, height: 800 }
];

for (const viewport of viewports) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });

  // Navigate to the local development server
  await page.goto('http://localhost:5173/');

  // Wait for content to load
  await page.waitForTimeout(2000);

  // Take a full page screenshot
  await page.screenshot({
    path: `homepage-${viewport.name}.png`,
    fullPage: true
  });

  console.log(`Screenshot saved as homepage-${viewport.name}.png`);
}

await browser.close();