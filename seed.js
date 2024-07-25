require("dotenv").config();
const mongoose = require("mongoose");
const { Quote } = require("./server");
const quotes = require("./quotes.json");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB for seeding");

    for (const quote of quotes) {
      await Quote.findOneAndUpdate(
        { id: quote.id },
        { $set: quote },
        { upsert: true, new: true }
      );
    }

    console.log("Database seeded");
    mongoose.connection.close();
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));
