const mongoose = require('mongoose');

async function test() {
    try {
        console.log("Connecting database via api call locally to get a user...");
        await mongoose.connect('mongodb+srv://gauravpatil:GauravPatil06@cluster0.jv91xdd.mongodb.net/EcoPulse?retryWrites=true&w=majority');
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Report = require('./models/Report'); 
        const user = await User.findOne({ role: 'Swachhta Mitra' }); 
        
        const collectorObjId = new mongoose.Types.ObjectId(user._id); 
        const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); 
        const startOfYear = new Date(new Date().getFullYear(), 0, 1); 
        
        const [assigned, completed, inProgress, pending, pickups, dailyStats, monthlyStats, yearlyStats] = await Promise.all([
            Report.countDocuments({ zone: user.zone, status: { $ne: 'Rejected' } }), 
            Report.countDocuments({ collectorId: user._id, status: 'Resolved' }), 
            Report.countDocuments({ zone: user.zone, status: 'In Progress' }), 
            Report.countDocuments({ zone: user.zone, status: 'Pending' }), 
            Report.find({ zone: user.zone }, { photos: { $slice: 1 } }).sort({ createdAt: -1 }).limit(10).lean(), 
            Report.aggregate([{ $match: { collectorId: collectorObjId, updatedAt: { $gte: thirtyDaysAgo }, status: 'Resolved' } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }, total: { $sum: 1 }, resolved: { $sum: 1 }, pending: { $sum: 0 }, inProgress: { $sum: 0 } } }, { $sort: { '_id': 1 } }]), 
            Report.aggregate([{ $match: { collectorId: collectorObjId, updatedAt: { $gte: startOfYear }, status: 'Resolved' } }, { $group: { _id: { year: { $year: '$updatedAt' }, month: { $month: '$updatedAt' } }, total: { $sum: 1 }, resolved: { $sum: 1 }, pending: { $sum: 0 }, inProgress: { $sum: 0 } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }]), 
            Report.aggregate([{ $match: { collectorId: collectorObjId, status: 'Resolved' } }, { $group: { _id: { $year: '$updatedAt' }, total: { $sum: 1 }, resolved: { $sum: 1 }, pending: { $sum: 0 }, inProgress: { $sum: 0 } } }, { $sort: { '_id': 1 } }])
        ]); 
        const calcScore  = (r) => r * 50;
        const calcBadges = (r) => Math.floor(r / 2);
        
        const resObj = {
            monthlyStats: monthlyStats.map(d => ({
                name: `${d._id.year}-${String(d._id.month).padStart(2, '0')}`,
                total: d.total,
                resolved: d.resolved,
                pending: d.pending || 0,
                inProgress: d.inProgress || 0,
                score: calcScore(d.resolved),
                badges: calcBadges(d.resolved)
            })),
            yearlyStats: yearlyStats.map(d => ({
                name: d._id.toString(),
                total: d.total,
                resolved: d.resolved,
                pending: d.pending || 0,
                inProgress: d.inProgress || 0,
                score: calcScore(d.resolved),
                badges: calcBadges(d.resolved)
            }))
        };
        console.log('SUCCESS MAP:', resObj.monthlyStats);
    } catch (e) {
        console.log('API ERROR:', e.message);
    }
    process.exit(0);
}

test();
