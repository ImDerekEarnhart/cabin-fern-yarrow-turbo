import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const html = pathToFileURL(join(root, "og-card.html")).href;
const outPng = join(root, "og-card-raw.png");

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto(html, { waitUntil: "load", timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: outPng, type: "png", omitBackground: false });
  console.log(JSON.stringify({ ok: true, screenshot: outPng, html }));
} finally {
  await browser.close();
}
