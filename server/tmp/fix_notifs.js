const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const Notification = require('../models/Notification');

async function fix() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Searching for old "Proof" notifications...');
        
        // Exact replacement for title
        const res1 = await Notification.updateMany(
            { title: 'Proof Uploaded' },
            { $set: { title: 'Evidence Uploaded' } }
        );
        
        // Exact replacement for message
        const res2 = await Notification.updateMany(
            { message: /Proof of work has been uploaded/i },
            { $set: { message: '📸 Evidence has been uploaded. You can view it now.' } }
        );

        console.log(`Success: Updated ${res1.modifiedCount} titles and ${res2.modifiedCount} messages.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

fix();
