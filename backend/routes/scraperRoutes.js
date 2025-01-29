const express = require("express");
const { scrapeYouTube } = require("../controllers/youtubeScraper");
const { scrapeTikTok } = require("../controllers/tiktokScraper");
const { scrapeInstagram } = require("../controllers/instagramScraper");
const { scrapeFacebook } = require("../controllers/facebookScraper");

const router = express.Router();

router.post("/", async (req, res) => {
  const { url, platform } = req.body;

  try {
    let data;
    switch (platform) {
      case "youtube":
        data = await scrapeYouTube(url);
        break;
      case "tiktok":
        data = await scrapeTikTok(url);
        break;
      case "instagram":
        data = await scrapeInstagram(url);
        break;
      case "facebook":
        data = await scrapeFacebook(url);
        break;
      default:
        return res.status(400).json({ error: "Invalid platform selected" });
    }
    res.json(data);
  } catch (error) {
    console.error("Error scraping:", error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

module.exports = router;
