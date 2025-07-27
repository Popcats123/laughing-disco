const express = require("express");
const cors = require("cors");
const https = require('https');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// YOUR IMAGE URLS - Replace with your actual direct image URLs
const images = [
  "https://i.postimg.cc/T2czZRGL/c75db7323801421faafb260c65a45300.png",  // Replace with your actual direct image URLs
  "https://i.postimg.cc/zG46nvwM/GNVF1-P5-X0-AABLJc.png",  // These MUST be direct image links ending in .png, .jpg, etc.
  "https://i.postimg.cc/prV62Fx9/IMG-0110.png",
  "https://i.postimg.cc/d3WSDVt5/8btmhq88z5s71.png",
  "https://i.postimg.cc/59PPBjb3/13ny-squirrel-jzgv-article-Large.png"
];

// Function to fetch and serve image
function serveRandomImage(req, res) {
  try {
    // Pick random image
    const randomImageUrl = images[Math.floor(Math.random() * images.length)];
    console.log(`🎲 Serving random image: ${randomImageUrl}`);

    // Determine if it's http or https
    const client = randomImageUrl.startsWith('https://') ? https : http;

    // Fetch the image
    client.get(randomImageUrl, (imageRes) => {
      // Set headers to serve as image
      res.set({
        'Content-Type': imageRes.headers['content-type'] || 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      // Pipe the image data directly to response
      imageRes.pipe(res);
      
    }).on('error', (error) => {
      console.error('❌ Error fetching image:', error);
      res.status(500).send('Error loading image');
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).send('Server error');
  }
}

// Main endpoint - just returns a random image
app.get("/", serveRandomImage);
app.get("/image", serveRandomImage);
app.get("/random", serveRandomImage);

// Health check (returns JSON)
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    images: images.length,
    timestamp: new Date().toISOString()
  });
});

// Info endpoint
app.get("/info", (req, res) => {
  res.json({
    message: "ArblikesdickCoin Dynamic Image Server",
    description: "Returns a random image on each request",
    endpoints: {
      "/": "Random image",
      "/image": "Random image", 
      "/random": "Random image",
      "/health": "Health check",
      "/info": "This info"
    },
    total_images: images.length
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Image server running on port ${PORT}`);
  console.log(`🖼️  Serving ${images.length} random images`);
  console.log(`📍 Main endpoint: / (returns random image)`);
});

module.exports = app;
