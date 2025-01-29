const puppeteer = require("puppeteer");

const scrapeYouTube = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const data = await page.evaluate(() => {
    return {
      title: document.querySelector("h1.title")?.innerText || "No Title Found",
      views: document.querySelector(".view-count")?.innerText || "No View Count Found",
      channel: document.querySelector("#text a")?.innerText || "No Channel Name Found",
    };
  });

  await browser.close();
  return data;
};

module.exports = { scrapeYouTube };
