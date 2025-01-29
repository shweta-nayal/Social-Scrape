const puppeteer = require("puppeteer");

const scrapeInstagram = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const data = await page.evaluate(() => {
    return {
      username: document.querySelector("h2")?.innerText || "No Username Found",
      followers: document.querySelector("span[title]")?.innerText || "No Followers Found",
      posts: document.querySelector("span[class='g47SY']")?.innerText || "No Post Count Found",
    };
  });

  await browser.close();
  return data;
};

module.exports = { scrapeInstagram };
