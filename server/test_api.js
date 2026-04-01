const mongoose = require('mongoose');

async function test() {
    try {
        console.log("Connecting database via api call locally to get a user...");
        await mongoose.connect('mongodb+srv://gauravpatil:GauravPatil06@cluster0.jv91xdd.mongodb.net/EcoPulse?retryWrites=true&w=majority');
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const userDoc = await User.findOne({ role: 'Swachhta Mitra' });
        
        if (!userDoc) {
            console.log("No collector found!");
            return;
        }

        console.log("Found user:", userDoc.email);
        const jwt = require('jsonwebtoken');
        const payload = {
            user: { id: userDoc._id.toString(), role: userDoc.role }
        };
        const token = jwt.sign(payload, 'your_jwt_secret_here', { expiresIn: '5d' });
        
        console.log("Generated token, hitting API...");
        const res = await fetch('http://localhost:5000/api/dashboard/collector', {
            headers: { 'x-auth-token': token }
        });
        const data = await res.text();
        console.log('API STATUS:', res.status, data);
    } catch (e) {
        console.log('API ERROR:', e.message);
    }
    process.exit(0);
}

test();
