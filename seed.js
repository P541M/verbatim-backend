const mongoose = require("mongoose");
const Quote = require("./server");
const quotes = require("./quotes.json"); // Import quotes from JSON file

mongoose
  .connect("mongodb://localhost:27017/quoteApp")
  .then(async () => {
    console.log("Connected to MongoDB for seeding");

    await Quote.deleteMany({}); // Clear existing quotes

    for (const quote of quotes) {
      const newQuote = new Quote(quote);
      await newQuote.save();
    }

    console.log("Database seeded");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });
