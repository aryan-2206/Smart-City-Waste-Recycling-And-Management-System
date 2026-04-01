const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Report = require('./models/Report');
const UserBadge = require('./models/UserBadge');
const Notification = require('./models/Notification');
const User = require('./models/User');

dotenv.config();

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- RESETTING TEST DATA ---');

        await Promise.all([
            Report.deleteMany({}),
            UserBadge.deleteMany({}),
            Notification.deleteMany({}),
            // Reseting user scores too for a fresh start
            User.updateMany({}, { totalScore: 0, dailyScore: 0, rewardPoints: 0 })
        ]);

        console.log('✓ ALL REPORTS DELETED');
        console.log('✓ ALL EARNED BADGES DELETED');
        console.log('✓ ALL NOTIFICATIONS DELETED');
        console.log('✓ ALL USER SCORES RESET');
        console.log('--- READY FOR CLEAN TEST ---');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

reset();
