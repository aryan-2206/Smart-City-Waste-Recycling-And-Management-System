const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { broadcastEvent } = require('./sse');

// @route   POST /api/tracking/location
// @desc    Update collector's current location
// @access  Private (Collector/Swachhta Mitra)
router.post('/location', auth, async (req, res) => {
    try {
        if (req.user.role !== 'Swachhta Mitra' && req.user.role !== 'collector') {
            return res.status(403).json({ message: 'Only collectors can update location' });
        }

        const { lat, lng } = req.body;
        
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        // We could save this to the DB, but for real-time tracking, 
        // we can just broadcast it via SSE directly.
        const locationData = {
            collectorId: req.user.id,
            lat,
            lng,
            timestamp: new Date()
        };

        // Broadcast to all connected clients (Admins and Citizens tracking)
        broadcastEvent('collector_location_update', locationData);

        res.json({ success: true, message: 'Location updated' });
    } catch (err) {
        console.error('Tracking update error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
