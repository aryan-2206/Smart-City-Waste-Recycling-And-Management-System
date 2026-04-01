const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing MongoDB connection to:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('SYNC TEST: MongoDB Connected Successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('SYNC TEST: MongoDB Connection FAILED');
        console.error(err);
        process.exit(1);
    });

setTimeout(() => {
    console.log('SYNC TEST: Connection timed out after 10s');
    process.exit(1);
}, 10000);
