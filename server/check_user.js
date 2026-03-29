require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");
    
    // Find all users and log their emails exactly
    const user = await User.findOne({ email: 'gp949958@gmail.com' });
    console.log("User details:", JSON.stringify(user, null, 2));

    process.exit(0);
}

check();
