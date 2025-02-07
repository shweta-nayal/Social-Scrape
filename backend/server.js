const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;  // Use dynamic port for deployment

// ✅ Configure CORS properly
app.use(cors({
    origin: "*",  // Allow all origins (for debugging, restrict later)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.post('/api/scrape', async (req, res) => {  // ✅ Ensure API route is prefixed with `/api`
    const { url, platform } = req.body;

    if (!url || !platform) {
        return res.status(400).json({ error: 'URL and platform are required' });
    }

    try {
        let scrapedData = {};

        if (platform === 'youtube') {
            const videoId = url.split('v=')[1]?.split('&')[0];
            if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

            const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                params: { part: 'snippet,statistics', id: videoId, key: process.env.YOUTUBE_API_KEY }
            });

            const videoData = videoResponse.data.items[0];
            if (!videoData) return res.status(404).json({ error: 'Video not found' });

            scrapedData = {
                title: videoData.snippet.title,
                channelName: videoData.snippet.channelTitle,
                likes: videoData.statistics.likeCount || 'Not Available',
                views: videoData.statistics.viewCount || 'Not Available',
                comments: videoData.statistics.commentCount || 'Not Available'
            };

        } else {
            return res.status(400).json({ error: 'Unsupported platform' });
        }

        return res.json(scrapedData);

    } catch (error) {
        console.error('Error scraping:', error.message);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
