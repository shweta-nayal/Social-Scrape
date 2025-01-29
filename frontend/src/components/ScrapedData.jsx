import React from 'react';

// This component will receive the scraped data as props
const ScrapedData = ({ data }) => {
  if (!data) {
    return <p>No data to display. Please enter a valid URL.</p>;
  }

  return (
    <div className="scraped-data-container">
      <h2>Scraped Data</h2>

      {/* Display different sections based on platform */}
      {data.title && (
        <div className="data-card">
          <h3>Video Title: {data.title}</h3>
          <p>Channel Name: {data.channelName}</p>
          <p>Likes: {data.likes}</p>
          <p>Subscribers: {data.subscribers}</p>
          <p>Comments: {data.comments}</p>
        </div>
      )}

      {data.username && (
        <div className="data-card">
          <h3>Username: {data.username}</h3>
          <p>Followers: {data.followers}</p>
          <p>Posts: {data.posts}</p>
          <p>Bio: {data.bio}</p>
        </div>
      )}

      {data.name && (
        <div className="data-card">
          <h3>Name: {data.name}</h3>
          <p>Posts: {data.posts}</p>
          <p>Bio: {data.about}</p>
        </div>
      )}

      {/* Add other social platforms as necessary */}
    </div>
  );
};

export default ScrapedData;
