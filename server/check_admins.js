const mongoose = require('mongoose');

async function checkAdmins() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cleanpulse');
        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String
        }, { collection: 'users' }));
        
        const count = await User.countDocuments({ role: 'admin' });
        console.log(`Found ${count} admins`);
        if (count > 0) {
            const admins = await User.find({ role: 'admin' });
            admins.forEach(a => console.log(`ADMIN_EMAIL: ${a.email}`));
        } else {
            console.log('No admins found in database');
        }
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}

checkAdmins();
