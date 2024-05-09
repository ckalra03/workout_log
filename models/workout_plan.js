const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true }, // in weeks
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
});


const Workout_plan = mongoose.model('Workout_plan',workoutPlanSchema );

module.exports = Workout_plan;
