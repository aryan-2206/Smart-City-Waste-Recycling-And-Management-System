const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('./models/Notification');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        
        const count = await Notification.countDocuments();
        console.log('Total Notifications in DB:', count);

        const recent = await Notification.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name role');
        console.log('Recent 5 Notifications:', JSON.stringify(recent, null, 2));

        const usersCount = await User.countDocuments();
        console.log('Total Users:', usersCount);

        const users = await User.find().select('name role');
        console.log('Users Roles Summary:', users.map(u => `${u.name} (${u.role})`).join(', '));

        process.exit();
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
