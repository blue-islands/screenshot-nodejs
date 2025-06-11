const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 8091;

app.get("/screenshot", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("Missing ?url parameter");
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    const screenshotBuffer = await page.screenshot({ fullPage: true });

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
