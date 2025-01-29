const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Scraping Function for YouTube
const scrapeYouTube = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extract YouTube data
    const data = await page.evaluate(() => {
      const title = document.querySelector('h1.title')?.innerText || 'No Title';
      const channelName = document.querySelector('ytd-channel-name a')?.innerText || 'No Channel';
      const likes = document.querySelector('yt-formatted-string[aria-label*="likes"]')?.innerText || 'No Likes';
      const subscribers = document.querySelector('#owner-sub-count')?.innerText || 'No Subscribers';
      const comments = document.querySelector('h2#count')?.innerText || 'No Comments';
      
      return {
        title,
        channelName,
        likes,
        subscribers,
        comments,
      };
    });

    await browser.close();

    return data;
  } catch (error) {
    console.error('Error scraping YouTube:', error);
    throw new Error('Error scraping YouTube');
  }
};

// Scraping Function for Instagram
const scrapeInstagram = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
      const username = document.querySelector('h1.rhpdm')?.innerText || 'No Username';
      const followers = document.querySelector('.k9GMp')?.innerText || 'No Followers';
      const posts = document.querySelector('span.g47SY')?.innerText || 'No Posts';
      const bio = document.querySelector('div.-vDIg')?.innerText || 'No Bio';

      return {
        username,
        followers,
        posts,
        bio,
      };
    });

    await browser.close();

    return data;
  } catch (error) {
    console.error('Error scraping Instagram:', error);
    throw new Error('Error scraping Instagram');
  }
};

// Scraping Function for Facebook (Simplified Example)
const scrapeFacebook = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
      const name = document.querySelector('h1')?.innerText || 'No Name';
      const posts = document.querySelector('span[data-testid="profile_pane_count"]')?.innerText || 'No Posts';
      const about = document.querySelector('div._4bl9')?.innerText || 'No Bio';

      return {
        name,
        posts,
        about,
      };
    });

    await browser.close();

    return data;
  } catch (error) {
    console.error('Error scraping Facebook:', error);
    throw new Error('Error scraping Facebook');
  }
};

// Scraping Function for TikTok (Simplified Example)
const scrapeTikTok = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
      const username = document.querySelector('h1')?.innerText || 'No Username';
      const followers = document.querySelector('.share-follow-count')?.innerText || 'No Followers';
      const likes = document.querySelector('.like-count')?.innerText || 'No Likes';

      return {
        username,
        followers,
        likes,
      };
    });

    await browser.close();

    return data;
  } catch (error) {
    console.error('Error scraping TikTok:', error);
    throw new Error('Error scraping TikTok');
  }
};

// Scraping Endpoint
app.post('/scrape', async (req, res) => {
  const { url, platform } = req.body;

  try {
    let data;

    switch (platform) {
      case 'youtube':
        data = await scrapeYouTube(url);
        break;
      case 'instagram':
        data = await scrapeInstagram(url);
        break;
      case 'facebook':
        data = await scrapeFacebook(url);
        break;
      case 'tiktok':
        data = await scrapeTikTok(url);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported platform' });
    }

    res.json(data); // Send scraped data back to frontend
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
