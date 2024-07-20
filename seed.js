const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction
const Quote = require("./server"); // Import the Quote model from server.js

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/quoteApp")
  .then(async () => {
    console.log("Connected to MongoDB for seeding"); // Log success message if connected

    // Array of quotes to be seeded into the database
    const quotes = [
      {
        id: 1,
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt",
      },
      {
        id: 2,
        text: "The purpose of our lives is to be happy.",
        author: "Dalai Lama",
      },
      // Add more quotes here
    ];

    await Quote.deleteMany({}); // Clear existing quotes from the database

    // Loop through each quote in the array and save it to the database
    for (const quote of quotes) {
      const newQuote = new Quote(quote); // Create a new Quote instance
      await newQuote.save(); // Save the Quote instance to the database
    }

    console.log("Database seeded"); // Log success message when seeding is complete
    mongoose.connection.close(); // Close the MongoDB connection
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err); // Log error message if connection fails
  });
