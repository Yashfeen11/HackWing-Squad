// models/Reading.js
const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
    zone: {
        type: String,
        required: true
    },
    inletFlow: {
        type: Number,
        required: true
    },
    outletFlow: {
        type: Number,
        required: true
    },
    pressure: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    confidence: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reading', ReadingSchema);