const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    goalType: { type: String }, // Example: Weight Loss, Muscle Gain, Endurance Improving, etc.
    target: { type: String },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, default: 'In Progress' } // In Progress, Achieved, Not Achieved
});

const Goals = mongoose.model('Goals', goalsSchema);
module.exports = Goals;

