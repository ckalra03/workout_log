const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    notes: { type: String },
    mood: { type: String }, // Example: Energized, Tired, Sore, etc.
    effectiveness: { type: Number } // Rating scale 1-10
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
