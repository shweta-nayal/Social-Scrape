const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// API Keys & Access Tokens
const YOUTUBE_API_KEY = 'AIzaSyAHvI1uVIHB6qPBTb-_TJz3jzO_RSeMQkw';
const FACEBOOK_ACCESS_TOKEN = 'YOUR_FACEBOOK_ACCESS_TOKEN';
const INSTAGRAM_ACCESS_TOKEN = 'YOUR_INSTAGRAM_ACCESS_TOKEN';
const TIKTOK_CLIENT_KEY = 'YOUR_TIKTOK_CLIENT_KEY';

app.use(express.json());
// app.use(cors());
app.use(cors({ origin: "*" }));

app.post('/scrape', async (req, res) => {
    const { url, platform } = req.body;

    if (!url || !platform) {
        return res.status(400).json({ error: 'URL and platform are required' });
    }

    try {
        let scrapedData = {};

        if (platform === 'youtube') {
            // YOUTUBE VIDEO SCRAPING
            const videoId = url.split('v=')[1]?.split('&')[0];
            if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

            const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                params: { part: 'snippet,statistics', id: videoId, key: YOUTUBE_API_KEY }
            });

            const videoData = videoResponse.data.items[0];
            if (!videoData) return res.status(404).json({ error: 'Video not found' });

            scrapedData = {
                title: videoData.snippet.title,
                channelName: videoData.snippet.channelTitle,
                likes: videoData.statistics.likeCount || 'Not Available',
                views: videoData.statistics.viewCount || 'Not Available',
                comments: videoData.statistics.commentCount || 'Not Available',
                subscribers: 'Fetching...'
            };

            const channelId = videoData.snippet.channelId;
            const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
                params: { part: 'statistics', id: channelId, key: YOUTUBE_API_KEY }
            });

            const channelData = channelResponse.data.items[0];
            if (channelData) scrapedData.subscribers = channelData.statistics.subscriberCount || 'Not Available';

        } else if (platform === 'instagram') {
            // INSTAGRAM POST SCRAPING
            const mediaId = url.split('/p/')[1]?.split('/')[0] || url.split('/reel/')[1]?.split('/')[0];
            if (!mediaId) return res.status(400).json({ error: 'Invalid Instagram URL' });

            const instaResponse = await axios.get(`https://graph.facebook.com/v17.0/${mediaId}`, {
                params: {
                    fields: 'like_count,comments_count,caption,owner{username}',
                    access_token: INSTAGRAM_ACCESS_TOKEN
                }
            });

            scrapedData = {
                username: instaResponse.data.owner.username,
                caption: instaResponse.data.caption || 'No caption',
                likes: instaResponse.data.like_count || '0',
                comments: instaResponse.data.comments_count || '0'
            };

        } else if (platform === 'facebook') {
            // FACEBOOK POST SCRAPING
            const postId = url.split('/posts/')[1]?.split('/')[0];
            if (!postId) return res.status(400).json({ error: 'Invalid Facebook Post URL' });

            const fbResponse = await axios.get(`https://graph.facebook.com/v17.0/${postId}`, {
                params: {
                    fields: 'likes.summary(true),comments.summary(true),message,from',
                    access_token: FACEBOOK_ACCESS_TOKEN
                }
            });

            scrapedData = {
                username: fbResponse.data.from.name,
                post: fbResponse.data.message || 'No description',
                likes: fbResponse.data.likes?.summary.total_count || '0',
                comments: fbResponse.data.comments?.summary.total_count || '0'
            };

        } else if (platform === 'tiktok') {
            // TIKTOK VIDEO SCRAPING
            const videoId = url.split('/video/')[1]?.split('?')[0];
            if (!videoId) return res.status(400).json({ error: 'Invalid TikTok URL' });

            const tiktokResponse = await axios.get(`https://open-api.tiktok.com/video/info/`, {
                params: { video_id: videoId, client_key: TIKTOK_CLIENT_KEY }
            });

            const video = tiktokResponse.data.data.video_info;
            scrapedData = {
                username: video.author.nickname,
                caption: video.desc || 'No caption',
                likes: video.stats.digg_count || '0',
                comments: video.stats.comment_count || '0'
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
    console.log(`Server is running on http://localhost:${PORT}`);
});
