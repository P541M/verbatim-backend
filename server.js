require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const quoteSchema = new mongoose.Schema({
  id: Number,
  text: String,
  author: String,
  category: [String],
  likes: { type: Number, default: 0 },
  likedBy: [String],
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

// Endpoint to unlike a quote
app.post("/quotes/:id/unlike", async (req, res) => {
  const { id } = req.params;
  const { deviceId } = req.body;

  try {
    const quote = await Quote.findOne({ id: id });

    if (!quote) {
      return res
        .status(404)
        .json({ success: false, message: "Quote not found" });
    }

    if (quote.likedBy.includes(deviceId)) {
      quote.likes -= 1;
      quote.likedBy = quote.likedBy.filter((id) => id !== deviceId);
      await quote.save();
      res.json({ success: true, likes: quote.likes });
    } else {
      res.json({ success: false, message: "Quote not liked by this device" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error unliking quote" });
  }
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

module.exports = app;
