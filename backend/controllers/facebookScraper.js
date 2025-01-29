const puppeteer = require("puppeteer");

const scrapeFacebook = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const data = await page.evaluate(() => {
    return {
      name: document.querySelector("h1")?.innerText || "No Name Found",
      friends: document.querySelector("[data-testid='friend_count']")?.innerText || "No Friend Count Found",
      posts: document.querySelector("[data-testid='post_count']")?.innerText || "No Post Count Found",
    };
  });

  await browser.close();
  return data;
};

module.exports = { scrapeFacebook };
