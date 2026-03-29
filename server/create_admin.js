const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in .env');
        }
        
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB Atlas...');
        
        const UserSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            phone: { type: String, required: true },
            role: { type: String, enum: ['citizen', 'collector', 'admin'], default: 'citizen' },
            zone: { type: String, required: true },
            isActive: { type: Boolean, default: true },
            lastLogin: { type: Date, default: Date.now },
            rewardPoints: { type: Number, default: 0 }
        }, { timestamps: true });

        // Check if the model is already defined to avoid OverwriteModelError
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const email = 'admin@gmail.com';
        const password = 'Admin@06';
        
        // Remove existing admin with this email if it exists
        await User.deleteOne({ email: email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = new User({
            name: 'EcoPulse Admin',
            email: email,
            password: hashedPassword,
            phone: '1234567890',
            zone: 'All',
            role: 'admin'
        });

        await adminUser.save();
        console.log(`Admin user created: ${email} / ${password} (EcoPulse)`);
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
}

createAdmin();
