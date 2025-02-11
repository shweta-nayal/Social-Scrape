import React from "react";
import "./ScrapedData.css"; 

const ScrapedData = ({ data }) => {
  if (!data) {
    return <p className="error-message">No data available. Please enter a valid URL.</p>;
  }

  return (
    <div className="scraped-data-container">
      <h2>Scraped Data</h2>

      {/* YouTube Data */}
      {data.title && (
        <div className="data-card">
          <h3>🎥 YouTube Video</h3>
          <p><strong>Title:</strong> {data.title}</p>
          <p><strong>Channel Name:</strong> {data.channelName || "N/A"}</p>
          <p><strong>Likes:</strong> {data.likes || "N/A"}</p>
          <p><strong>Subscribers:</strong> {data.subscribers || "N/A"}</p>
          <p><strong>Comments:</strong> {data.comments || "N/A"}</p>
        </div>
      )}

      {/* Instagram / TikTok / Facebook Data */}
      {data.username && (
        <div className="data-card">
          <h3>📸 Social Media Profile</h3>
          <p><strong>Username:</strong> {data.username}</p>
          <p><strong>Followers:</strong> {data.followers || "N/A"}</p>
          <p><strong>Posts:</strong> {data.posts || "N/A"}</p>
          <p><strong>Bio:</strong> {data.bio || "N/A"}</p>
        </div>
      )}

      {/* Facebook Pages */}
      {data.name && (
        <div className="data-card">
          <h3>📘 Facebook Page</h3>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Posts:</strong> {data.posts || "N/A"}</p>
          <p><strong>About:</strong> {data.about || "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default ScrapedData;
