const express = require("express"); // Import Express framework
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction
const cors = require("cors"); // Import CORS to allow cross-origin requests
const bodyParser = require("body-parser"); // Import body-parser to parse request bodies

const app = express(); // Create an Express application
const PORT = 5000; // Define the port number for the server

app.use(cors()); // Use CORS middleware to allow cross-origin requests
app.use(bodyParser.json()); // Use body-parser middleware to parse JSON request bodies

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/quoteApp")
  .then(() => {
    console.log("Connected to MongoDB"); // Log success message if connected
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err); // Log error message if connection fails
  });

// Define a Mongoose schema for quotes
const quoteSchema = new mongoose.Schema({
  id: Number, // Quote ID
  text: String, // Quote text
  author: String, // Quote author
  likes: { type: Number, default: 0 }, // Number of likes (default is 0)
  likedBy: [String], // Array of device IDs that have liked the quote
});

// Create a Mongoose model for quotes
const Quote = mongoose.model("Quote", quoteSchema);

// Endpoint to get all quotes
app.get("/quotes", async (req, res) => {
  try {
    const quotes = await Quote.find(); // Fetch all quotes from the database
    res.json(quotes); // Send the quotes as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching quotes" }); // Send error message if something goes wrong
  }
});

// Endpoint to like a quote
app.post("/quotes/:id/like", async (req, res) => {
  const { id } = req.params; // Extract quote ID from URL parameters
  const { deviceId } = req.body; // Extract device ID from request body

  try {
    const quote = await Quote.findOne({ id: id }); // Find the quote by ID

    if (!quote) {
      return res
        .status(404)
        .json({ success: false, message: "Quote not found" }); // Send error if quote not found
    }

    if (!quote.likedBy.includes(deviceId)) {
      quote.likes += 1; // Increment likes if the device hasn't liked the quote
      quote.likedBy.push(deviceId); // Add the device ID to likedBy array
      await quote.save(); // Save the updated quote to the database
      res.json({ success: true, likes: quote.likes }); // Send success response with updated likes
    } else {
      res.json({ success: false, message: "Already liked by this device" }); // Send error if the device already liked the quote
    }
  } catch (error) {
    res.status(500).json({ message: "Error liking quote" }); // Send error message if something goes wrong
  }
});

// Endpoint to reset likes for all quotes
app.post("/reset-likes", async (req, res) => {
  try {
    await Quote.updateMany({}, { $set: { likes: 0, likedBy: [] } }); // Reset likes and likedBy array for all quotes
    res.json({ success: true, message: "All likes reset" }); // Send success response
  } catch (error) {
    res.status(500).json({ message: "Error resetting likes" }); // Send error message if something goes wrong
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Log message indicating the server is running
});

module.exports = Quote; // Export the Quote model for use in other files
