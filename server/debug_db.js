const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Report = require('./models/Report');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        const count = await Report.countDocuments();
        console.log('Total Reports in DB:', count);
        const reports = await Report.find().limit(5);
        console.log('Sample Reports:', JSON.stringify(reports, null, 2));
        process.exit();
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
