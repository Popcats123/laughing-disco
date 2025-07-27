const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// YOUR 5 IMAGES - REPLACE WITH YOUR ACTUAL IMAGE URLS
const images = ["https://imgur.com/a/yVebMyr", "https://imgur.com/a/cbo6ok3"];

// Keep-alive function to prevent sleeping
function keepAlive() {
  setInterval(() => {
    // Ping own health endpoint every 14 minutes
    fetch(`https://laughing-disco.onrender.com/health`)
      .then(() => console.log('🏓 Keep-alive ping sent'))
      .catch(() => console.log('🚫 Keep-alive ping failed'));
  }, 14 * 60 * 1000); // 14 minutes
}

// Main metadata endpoint
app.get("/metadata", (req, res) => {
  try {
    // Pick random image
    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    // Return exact same format as your current metadata
    const metadata = {
      name: "ArblikesdickCoin",
      symbol: "Arbdick",
      uri: randomImage,
      sellerFeeBasisPoints: 0,
      creators: [
        {
          address: "WLHv2UAZm6z4KyaaELi5pjdbJh6RESMva1Rnn8pJVVh",
          verified: 1,
          share: 100,
        },
      ],
    };
    
    // Prevent caching
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Content-Type": "application/json",
    });
    
    console.log(`Serving random image: ${randomImage}`);
    res.json(metadata);
    
  } catch (error) {
    console.error('Error in /metadata:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    images: images.length,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "ArblikesdickCoin Dynamic Metadata Server",
    endpoint: "/metadata",
    status: "running"
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    available: ["/", "/metadata", "/health"]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Metadata endpoint: /metadata`);
  
  // Start keep-alive after server starts
  if (process.env.NODE_ENV === 'production') {
    keepAlive();
    console.log('🔄 Keep-alive started');
  }
});

module.exports = app;
