import React, { useState } from "react";
import "./ScraperForm.css";
import ScrapedData from "./ScrapedData"; 

const ScrapeForm = () => {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState(null); // Store scraped data

  const API_BASE_URL = "http://localhost:5000"; 

  const handleScrape = async () => {
    setError(null);
    setLoading(true);
    setScrapedData(null); // Resetting previous data

    if (!url.trim()) {
      setError("Please enter a valid URL");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const data = await response.json();
      console.log("Scraped Data:", data);
      setScrapedData(data); // Storing the scraped data
    } catch (error) {
      console.error("Error scraping data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
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
      <button onClick={handleScrape} disabled={loading}>
        {loading ? "Scraping..." : "Scrape Data"}
      </button>

      {error && <p className="error-message">{error}</p>}

      {/* Displaying Scraped Data Below the Form */}
      {scrapedData && <ScrapedData data={scrapedData} />}
    </div>
  );
};

export default ScrapeForm;
