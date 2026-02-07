const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to desktop size
  await page.setViewportSize({ width: 1440, height: 900 });

  // Navigate to the local development server
  await page.goto('http://localhost:5173/');

  // Wait for the announcement to be visible
  await page.waitForTimeout(2000);

  // Take a screenshot of just the announcement section
  const announcement = await page.locator('[class*="announcement"]').first();
  await announcement.screenshot({ path: 'announcement-current.png' });

  console.log('Screenshot saved as announcement-current.png');

  await browser.close();
})();