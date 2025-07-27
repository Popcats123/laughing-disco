const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// YOUR 5 IMAGES - REPLACE WITH YOUR ACTUAL IMAGE URLS
const images = ["https://imgur.com/a/yVebMyr", "https://imgur.com/a/cbo6ok3"];

// Main metadata endpoint
app.get("/metadata", (req, res) => {
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
    Pragma: "no-cache",
    Expires: "0",
    "Content-Type": "application/json",
  });

  console.log(`Serving random image: ${randomImage}`);
  res.json(metadata);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", images: images.length });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "WARMANUS Dynamic Metadata Server",
    endpoint: "/metadata",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
