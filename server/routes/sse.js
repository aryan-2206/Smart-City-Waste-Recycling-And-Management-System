const express = require('express');
const router = express.Router();

let clients = [];

// SSE Endpoint
router.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.flushHeaders();

    // Acknowledge connection
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    const clientId = Date.now() + Math.random().toString();
    const zone = req.query.zone || null; // Optional zone filter
    
    clients.push({ id: clientId, res, zone });

    // Heartbeat every 30s to keep connection alive
    const heartbeat = setInterval(() => {
        try {
            res.write(`: heartbeat\n\n`);
        } catch (e) {
            clearInterval(heartbeat);
        }
    }, 30000);

    // Remove client when connection closes
    req.on('close', () => {
        clearInterval(heartbeat);
        clients = clients.filter(client => client.id !== clientId);
    });
});

// Broadcast to all clients, optionally filtered by zone
const broadcastEvent = (type, data, targetZone = null) => {
    clients.forEach(client => {
        try {
            // If targetZone is specified, only send to clients in that zone (or clients with no zone filter)
            if (targetZone && client.zone && client.zone !== targetZone) return;
            client.res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
        } catch (error) {
            console.error('Error broadcasting to client:', error);
        }
    });
};

// Get connected client count (for diagnostics)
const getClientCount = () => clients.length;

module.exports = { router, broadcastEvent, getClientCount };
