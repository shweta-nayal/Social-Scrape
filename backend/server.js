const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// API Keys & Access Tokens
const YOUTUBE_API_KEY = 'AIzaSyAHvI1uVIHB6qPBTb-_TJz3jzO_RSeMQkw';

app.use(express.json());

// CORS Configuration (Allow requests from frontend)
app.use(cors({
    origin: 'http://localhost:5173',  
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.post('/scrape', async (req, res) => {
    const { url, platform } = req.body;

    if (!url || !platform) {
        return res.status(400).json({ error: 'URL and platform are required' });
    }

    try {
        let scrapedData = {};

        if (platform === 'youtube') {
            // Extract YouTube video ID
            const videoId = url.split('v=')[1]?.split('&')[0];
            if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

            // Fetch Video Details
            const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                params: { part: 'snippet,statistics', id: videoId, key: YOUTUBE_API_KEY }
            });

            const videoData = videoResponse.data.items?.[0];
            if (!videoData) return res.status(404).json({ error: 'Video not found' });

            scrapedData = {
                title: videoData.snippet.title,
                channelName: videoData.snippet.channelTitle,
                likes: videoData.statistics.likeCount || 'Not Available',
                views: videoData.statistics.viewCount || 'Not Available',
                comments: videoData.statistics.commentCount || 'Not Available',
                subscribers: 'Fetching...'
            };

            // Fetch Channel Subscribers
            const channelId = videoData.snippet.channelId;
            const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
                params: { part: 'statistics', id: channelId, key: YOUTUBE_API_KEY }
            });

            const channelData = channelResponse.data.items?.[0];
            if (channelData) {
                scrapedData.subscribers = channelData.statistics.subscriberCount || 'Not Available';
            }
        } else {
            return res.status(400).json({ error: 'Unsupported platform' });
        }

        return res.json(scrapedData);
    } catch (error) {
        console.error('Error scraping:', error.message);
        return res.status(500).json({ error: 'Failed to scrape data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
