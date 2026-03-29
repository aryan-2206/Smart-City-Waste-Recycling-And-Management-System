const mongoose = require('mongoose');

async function listAllUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cleanpulse');
        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String,
            password: String
        }, { collection: 'users' }));
        
        const users = await User.find({});
        console.log('USERS_START');
        console.log(JSON.stringify(users, null, 2));
        console.log('USERS_END');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listAllUsers();
