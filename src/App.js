import React from 'react';
import './App.css';
import ProjectTriangle from './pmtriangle';

function App() {
  return (
    <div className="App">
      {/* JSON-LD for structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Interactive Project Management Triangle",
          "description": "An interactive tool to visualize and balance the three constraints of project management: scope, time, and quality.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": "Interactive triangle visualization, Constraint locking, Strategy recommendations",
          "screenshot": "https://bohdanlev.github.io/pmtriangle/og-image.png",
          "url": "https://bohdanlev.github.io/pmtriangle/"
        })}
      </script>
      
      <ProjectTriangle />
    </div>
  );
}

export default App;