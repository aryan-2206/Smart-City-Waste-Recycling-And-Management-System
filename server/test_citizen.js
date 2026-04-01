const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const Report = require('./models/Report'); 
        const User = require('./models/User'); 
        const user = await User.findOne({ role: 'citizen' }); 
        if (!user) { console.log('No user'); process.exit(0); } 
        const citizenObjId = new mongoose.Types.ObjectId(user._id);
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        const x = await Promise.all([
            Report.countDocuments({ citizenId: citizenObjId }),
            Report.countDocuments({ citizenId: citizenObjId, status: 'Resolved' }),
            Report.countDocuments({ citizenId: citizenObjId, status: 'Pending' }),
            Report.countDocuments({ citizenId: citizenObjId, status: 'In Progress' }),
            Report.aggregate([
                { $match: { citizenId: citizenObjId, createdAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } }, pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } }, inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } } } },
                { $sort: { "_id": 1 } }
            ]),
            Report.aggregate([
                { $match: { citizenId: citizenObjId, createdAt: { $gte: startOfYear } } },
                { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } }, pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } }, inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } } } },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]),
            Report.aggregate([
                { $match: { citizenId: citizenObjId } },
                { $group: { _id: { $year: "$createdAt" }, total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } }, pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } }, inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } } } },
                { $sort: { "_id": 1 } }
            ])
        ]);
        console.log('SUCCESS CITIZEN');
    } catch (e) {
        console.log('ERROR:', e.message);
    }
    process.exit(0);
});
