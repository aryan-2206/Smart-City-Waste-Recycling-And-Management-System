const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    citizenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    garbageType: {
        type: String,
        required: true,
        enum: ['Household', 'Industrial', 'Medical', 'Construction', 'Other']
    },
    location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        default: 'Pune'
    },
    zone: {
        type: String,
        required: true
    },
    area: {
        type: String
    },
    landmark: {
        type: String
    },
    contactNumber: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    photos: [{
        type: String // URLs or paths to the uploaded images
    }],
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    collectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    evidenceUploaded: {
        type: Boolean,
        default: false
    },
    initialPhotoCount: {
        type: Number
    }
}, { timestamps: true });

// Indexing for faster queries as per Part 3 requirements
ReportSchema.index({ zone: 1, status: 1 });
ReportSchema.index({ citizenId: 1, status: 1 });
ReportSchema.index({ citizenId: 1, createdAt: -1 });
ReportSchema.index({ collectorId: 1, status: 1 });
ReportSchema.index({ collectorId: 1, status: 1, updatedAt: -1 });
ReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', ReportSchema);
