const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();
const PORT = process.env.PORT || 8091;

app.get("/screenshot", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("Missing ?url parameter");
  }

  let browser;
  try {
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser", // ← 環境に応じて変更（例: /snap/bin/chromium）
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-extensions",
        "--disable-default-apps",
        "--disable-popup-blocking",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
        "--disable-client-side-phishing-detection",
      ],
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 630,
    });
      
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    const screenshotBuffer = await page.screenshot({
      clip: { x: 0, y: 0, width: 1200, height: 630 },
      type: "png",
    });

    res.set("Content-Type", "image/png");
    res.send(screenshotBuffer);
  } catch (error) {
    console.error("Error taking screenshot:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
