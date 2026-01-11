// routes/readings.js
const express = require('express');
const router = express.Router();
const Reading = require('../models/Reading');

// POST - Save new reading
router.post('/', async (req, res) => {
    try {
        const { zone, inletFlow, outletFlow, pressure, status, confidence } = req.body;

        const newReading = new Reading({
            zone,
            inletFlow,
            outletFlow,
            pressure,
            status,
            confidence
        });

        const savedReading = await newReading.save();
        res.status(201).json(savedReading);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Latest reading
router.get('/latest', async (req, res) => {
    try {
        const latest = await Reading.findOne().sort({ timestamp: -1 });
        if (!latest) {
            return res.status(404).json({ message: 'No readings found' });
        }
        res.json(latest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Last 10 readings (history)
router.get('/history', async (req, res) => {
    try {
        const history = await Reading.find()
            .sort({ timestamp: -1 })
            .limit(10);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;