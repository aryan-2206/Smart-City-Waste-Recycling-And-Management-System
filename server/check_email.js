require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");
    
    // Find all users and log their emails exactly
    const users = await User.find({});
    console.log("All emails in DB:");
    users.forEach(u => console.log(`"${u.email}"`));

    process.exit(0);
}

check();
