const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bodyPart: { type: String, required: true },
    muscleTargeted: { type: String, required: true },
    description: { type: String }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
