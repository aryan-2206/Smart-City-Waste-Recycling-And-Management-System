const mongoose = require('mongoose');

async function listUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cleanpulse');
        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String
        }, { collection: 'users' }));
        
        const users = await User.find({});
        console.log('Users found:', JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listUsers();
