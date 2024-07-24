const mongoose = require("mongoose");
const Quote = require("./server"); // Adjust the path as necessary
const quotes = require("./quotes.json"); // Import quotes from JSON file

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });
