import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Set viewport to desktop size
await page.setViewportSize({ width: 1440, height: 900 });

// Navigate to the local development server
await page.goto('http://localhost:5173/');

// Wait for the page to load completely
await page.waitForTimeout(3000);

// Check for any console errors
page.on('console', msg => console.log('Browser console:', msg.text()));
page.on('pageerror', error => console.log('Page error:', error.message));

// Get page height and scroll height
const pageInfo = await page.evaluate(() => {
  const body = document.body;
  const html = document.documentElement;
  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  // Find all elements and their visibility
  const roadmaps = document.querySelectorAll('[class*="Roadmap"], [class*="roadmap"]');
  const elements = [];
  roadmaps.forEach(el => {
    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    elements.push({
      className: el.className,
      display: styles.display,
      visibility: styles.visibility,
      height: rect.height,
      width: rect.width,
      top: rect.top
    });
  });

  return {
    height,
    roadmapElements: elements,
    bodyHeight: document.body.scrollHeight,
    htmlHeight: document.documentElement.scrollHeight
  };
});

console.log('Page info:', JSON.stringify(pageInfo, null, 2));

// Take a full page screenshot
await page.screenshot({ path: 'full-page.png', fullPage: true });

console.log('Screenshot saved as roadmap-current.png');

await browser.close();