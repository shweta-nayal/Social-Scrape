import React, { useState } from "react";
import ScraperForm from "./components/ScraperForm";
import ScrapedData from "./components/ScrapedData";

const App = () => {
  const [scrapedData, setScrapedData] = useState(null);

  return (
    <div>
      <ScraperForm setScrapedData={setScrapedData} />
      {scrapedData && <ScrapedData data={scrapedData} />}
    </div>
  );
};

export default App;
