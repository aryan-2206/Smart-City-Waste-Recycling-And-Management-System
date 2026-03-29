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
    landmark: {
        type: String
    },
    zone: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    photo: {
        type: String // URL or path to the uploaded image
    },
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
    }
}, { timestamps: true });

// Indexing for faster queries as per Part 3 requirements
ReportSchema.index({ zone: 1, status: 1 });
ReportSchema.index({ citizenId: 1 });
ReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', ReportSchema);
