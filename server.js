const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/quoteApp")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

const quoteSchema = new mongoose.Schema({
  id: Number,
  text: String,
  author: String,
  category: String, // New field to differentiate between generic and specific quotes
  likes: { type: Number, default: 0 },
  likedBy: [String], // Store device IDs that have liked the quote
});

const Quote = mongoose.model("Quote", quoteSchema);

// Endpoint to get all quotes
app.get("/quotes", async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quotes" });
  }
});

// Endpoint to like a quote
app.post("/quotes/:id/like", async (req, res) => {
  const { id } = req.params;
  const { deviceId } = req.body;

  try {
    const quote = await Quote.findOne({ id: id });

    if (!quote) {
      return res
        .status(404)
        .json({ success: false, message: "Quote not found" });
    }

    if (!quote.likedBy.includes(deviceId)) {
      quote.likes += 1;
      quote.likedBy.push(deviceId);
      await quote.save();
      res.json({ success: true, likes: quote.likes });
    } else {
      res.json({ success: false, message: "Already liked by this device" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error liking quote" });
  }
});

// Endpoint to reset likes for all quotes
app.post("/reset-likes", async (req, res) => {
  try {
    await Quote.updateMany({}, { $set: { likes: 0, likedBy: [] } });
    res.json({ success: true, message: "All likes reset" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting likes" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = Quote;
