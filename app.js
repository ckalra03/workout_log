const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const User = require('./models/user');
const Exercise = require('./models/exercise');
const Workout = require('./models/workout');
const WorkoutPlan = require('./models/workout_plan');
const ProgressTracker = require('./models/progress_tracker');  // Assuming this model is correctly set up

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('Failed to connect to MongoDB:', err));

// Rate limiter for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 login requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Please authenticate.' });
    }
};

// User registration
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = new User({email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ _id: newUser._id.toString() }, process.env.JWT_SECRET, { expiresIn: '72h' });
        res.status(201).send({ user: newUser, token });
    } catch (error) {
        res.status(400).send({ message: "Error registering new user", error: error.message });
    }
});

// User login
app.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '72h' });
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(500).send({ message: "Login error", error: error.message });
    }
});

// User CRUD
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: "Error fetching users", error: error.message });
    }
});

// Exercise CRUD
app.post('/exercises', async (req, res) => {
    try {
        const newExercise = new Exercise(req.body);
        await newExercise.save();
        res.status(201).send({ message: "Exercise added successfully", exercise: newExercise });
    } catch (error) {
        res.status(400).send({ message: "Error adding exercise", error: error.message });
    }
});

app.get('/exercises', async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.status(200).send(exercises);
    } catch (error) {
        res.status(500).send({ message: "Error fetching exercises", error: error.message });
    }
});

// Workout CRUD
app.post('/workouts', async (req, res) => {
    try {
        const newWorkout = new Workout(req.body);
        await newWorkout.save();
        res.status(201).send({ message: "Workout added successfully", workout: newWorkout });
    } catch (error) {
        res.status(400).send({ message: "Error adding workout", error: error.message });
    }
});

app.get('/workouts', async (req, res) => {
    try {
        const workouts = await Workout.find().populate('exercises.exerciseId');
        res.status(200).send(workouts);
    } catch (error) {
        res.status(500).send({ message: "Error fetching workouts", error: error.message });
    }
});

// Workout Plan CRUD
app.post('/workoutplans', async (req, res) => {
    try {
        const newWorkoutPlan = new WorkoutPlan(req.body);
        await newWorkoutPlan.save();
        res.status(201).send({ message: "Workout Plan created successfully", workoutPlan: newWorkoutPlan });
    } catch (error) {
        res.status(400).send({ message: "Error creating workout plan", error: error.message });
    }
});

app.get('/workoutplans', async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlan.find().populate('exercises');
        res.status(200).send(workoutPlans);
    } catch (error) {
        res.status(500).send({ message: "Error fetching workout plans", error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

