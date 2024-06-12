const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();

const movieSchema = new mongoose.Schema({
    name: String,
    img: String,
    summary: String,
});

const Movie = mongoose.model("Movie", movieSchema);

app.use(bodyParser.json());

// Routes

app.post("/movies", async (req, res) => {
    try {
        const newMovie = await Movie.create(req.body);
        res.json(newMovie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/movies", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.put("/movies/:id", async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/movies/:id", async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

mongoose.set("strictQuery", false);

mongoose
    .connect(process.env.MONGODB_URI, {
        dbName: "karan",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(3000, () => {
            console.log("Node API Running on port 3000");
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
