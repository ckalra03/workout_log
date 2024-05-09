const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    exercises: [{
        exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
        sets: [{
            setNumber: Number,
            weight: Number,
            reps: Number,
            notes: String
        }]
    }]
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
