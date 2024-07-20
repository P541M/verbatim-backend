const mongoose = require("mongoose");
const Quote = require("./server");

mongoose
  .connect("mongodb://localhost:27017/quoteApp")
  .then(async () => {
    console.log("Connected to MongoDB for seeding");

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
