const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Workout = require('./workoutSchema');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Database connected successfully!"))
    .catch(err => console.error("Database connection failed:", err));

app.post('/workouts', async (req, res) => {
    const { user, date, duration, exercises } = req.body;

    if (!user || !date || !duration || !exercises) {
        return res.status(400).json({ error: "Validation failed: All required fields must be filled" });
    }

    try {
        const workout = new Workout(req.body);
        await workout.save();
        res.status(201).json({ message: "Workout created", workout });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get('/workouts', async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get('/workouts/:id', async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.put('/workouts/:id', async (req, res) => {
    try {
        const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.status(200).json({ message: "Workout updated", workout });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.delete('/workouts/:id', async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.status(200).json({ message: "Workout deleted" });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});
