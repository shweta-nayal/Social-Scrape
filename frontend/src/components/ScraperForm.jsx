import React, { useState } from "react";
import "./ScraperForm.css";

const ScrapeForm = () => {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [scrapedData, setScrapedData] = useState(null);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setError(null);
    setScrapedData(null);

    if (!url || !platform) {
      setError('Please enter a valid URL and select a platform.');
      return;
    }

    try {
      const response = await fetch("https://social-scrape-ohd1.vercel.app/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const data = await response.json();
      setScrapedData(data);
    } catch (error) {
      console.error('Error scraping data:', error.message);
      setError(`Error scraping data: ${error.message}`);
    }
  };


  return (
    <div className="scrape-form">
      <h2>Scrape Social Media Data</h2>
      <input
        type="text"
        placeholder="Enter Social Media URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
        <option value="youtube">YouTube</option>
        <option value="facebook">Facebook</option>
        <option value="instagram">Instagram</option>
        <option value="tiktok">TikTok</option>
      </select>
      <button onClick={handleScrape}>Scrape Data</button>

      {error && <p className="error-message">{error}</p>}

      {scrapedData && (
        <div className="scraped-data">
          <h3>Scraped Data:</h3>
          {platform === "youtube" && (
            <div>
              <p><strong>Video Title:</strong> {scrapedData.title}</p>
              <p><strong>Channel Name:</strong> {scrapedData.channelName}</p>
              <p><strong> No. of Views:</strong> {scrapedData.views}</p>
              <p><strong> No. of Likes:</strong> {scrapedData.likes}</p>
              <p><strong>Subscribers Count:</strong> {scrapedData.subscribers}</p>
              <p><strong>No. of Comments:</strong> {scrapedData.comments}</p>
            </div>
          )}

          {platform === "facebook" && (
            <div>
              <p><strong>Account Name:</strong> {scrapedData.name}</p>
              <p><strong>Account Created:</strong> {scrapedData.createdDate}</p>
              <p><strong>Posts:</strong> {scrapedData.posts}</p>
            </div>
          )}

          {platform === "instagram" && (
            <div>
              <p><strong>Account Name:</strong> {scrapedData.name}</p>
              <p><strong>Followers:</strong> {scrapedData.followers}</p>
              <p><strong>Posts:</strong> {scrapedData.posts}</p>
            </div>
          )}

          {platform === "tiktok" && (
            <div>
              <p><strong>Account Name:</strong> {scrapedData.accountName}</p>
              <p><strong>Followers:</strong> {scrapedData.followers}</p>
              <p><strong>Likes:</strong> {scrapedData.likes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScrapeForm;
