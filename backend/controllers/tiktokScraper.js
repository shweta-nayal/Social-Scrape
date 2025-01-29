const puppeteer = require("puppeteer");

const scrapeTikTok = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const data = await page.evaluate(() => {
    return {
      username: document.querySelector("h2")?.innerText || "No Username Found",
      followers: document.querySelector(".followers-count")?.innerText || "No Followers Found",
      likes: document.querySelector(".likes-count")?.innerText || "No Likes Found",
    };
  });

  await browser.close();
  return data;
};

module.exports = { scrapeTikTok };
