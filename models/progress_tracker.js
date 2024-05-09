const mongoose = require('mongoose');

const progressTrackerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    history: [{
        date: { type: Date, default: Date.now },
        weight: { type: Number },
        reps: { type: Number }
    }]
});

const ProgressTracker = mongoose.model('ProgressTracker', progressTrackerSchema);
module.exports = ProgressTracker;
