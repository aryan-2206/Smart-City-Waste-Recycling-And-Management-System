const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Report = require('../models/Report');
const auth = require('../middleware/auth');
const User = require('../models/User');
const UserBadge = require('../models/UserBadge');

// 🔥 Global Scoring Helpers for Graphs/Stats
const calcScore = (r, t, badges = 0) => (r * 50) + (t * 10) + (badges * 100);
const calcBadges = (r) => r > 0 ? Math.floor(r / 2) : 0;

// @route   GET /api/dashboard/citizen
// @desc    Get citizen dashboard stats and recent reports
// @access  Private (Citizen)
router.get('/citizen', auth, async (req, res) => {
    console.log('Citizen Dashboard Request - User:', req.user);
    if (req.user.role !== 'citizen') {
        console.warn('Access denied: Role is not citizen');
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const citizenObjId = new mongoose.Types.ObjectId(req.user.id);
        console.log(`[API] Citizen Dashboard - Querying DB for User: ${citizenObjId}`);

        const [total, resolved, pending, inProgress] = await Promise.all([
            Report.countDocuments({ citizenId: citizenObjId }),
            Report.countDocuments({ citizenId: citizenObjId, status: 'Resolved' }),
            Report.countDocuments({ citizenId: citizenObjId, status: 'Pending' }),
            Report.countDocuments({ citizenId: citizenObjId, status: 'In Progress' })
        ]);
        console.log(`[API] Citizen Docs Found - Total: ${total}, Resolved: ${resolved}`);

        const recentReports = await Report.find({ citizenId: citizenObjId }, { photos: { $slice: 1 } })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const stats = { total, resolved, pending, inProgress };

        // Daily Stats — last 30 days so current-month data always appears
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyStats = await Report.aggregate([
            { 
                $match: { 
                    citizenId: citizenObjId,
                    createdAt: { $gte: thirtyDaysAgo }
                } 
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total:      { $sum: 1 },
                    resolved:   { $sum: { $cond: [{ $eq: ["$status", "Resolved"]    }, 1, 0] } },
                    pending:    { $sum: { $cond: [{ $eq: ["$status", "Pending"]     }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Monthly Stats — all months of the current year
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const monthlyStats = await Report.aggregate([
            { 
                $match: { 
                    citizenId: citizenObjId,
                    createdAt: { $gte: startOfYear }
                } 
            },
            {
                $group: {
                    _id: { 
                        year:  { $year:  "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    total:      { $sum: 1 },
                    resolved:   { $sum: { $cond: [{ $eq: ["$status", "Resolved"]    }, 1, 0] } },
                    pending:    { $sum: { $cond: [{ $eq: ["$status", "Pending"]     }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Yearly Stats — all time, grouped by year
        const yearlyStats = await Report.aggregate([
            { $match: { citizenId: citizenObjId } },
            {
                $group: {
                    _id:        { $year: "$createdAt" },
                    total:      { $sum: 1 },
                    resolved:   { $sum: { $cond: [{ $eq: ["$status", "Resolved"]    }, 1, 0] } },
                    pending:    { $sum: { $cond: [{ $eq: ["$status", "Pending"]     }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const today = new Date(); today.setHours(0,0,0,0);
        const userProfile = await User.findById(req.user.id).lean();
        
        // 🔥 Instant Reset Logic: If last update was before today, daily is 0
        const isSameDay = userProfile?.lastScoreUpdate && 
                         new Date(userProfile.lastScoreUpdate).toDateString() === new Date().toDateString();
        
        const totalScore = userProfile?.totalScore || 0;
        const dailyScore = isSameDay ? (userProfile?.dailyScore || 0) : 0;
        const totalBadges = await UserBadge.countDocuments({ userId: req.user.id });

        res.json({
            stats: { 
                total, 
                resolved, 
                pending, 
                inProgress,
                totalScore,
                dailyScore,
                totalBadges
            },
            recentReports,
            dailyStats: dailyStats.map(d => ({
                name:       d._id || 'Unknown',
                total:      d.total,
                resolved:   d.resolved,
                pending:    d.pending,
                inProgress: d.inProgress,
                score:      calcScore(d.resolved, d.total),
                badges:     calcBadges(d.resolved)
            })),
            monthlyStats: monthlyStats.map(d => ({
                name:       d._id ? `${d._id.year}-${String(d._id.month).padStart(2, '0')}` : 'Unknown',
                total:      d.total,
                resolved:   d.resolved,
                pending:    d.pending,
                inProgress: d.inProgress,
                score:      calcScore(d.resolved, d.total),
                badges:     calcBadges(d.resolved)
            })),
            yearlyStats: yearlyStats.map(d => ({
                name:       d._id ? d._id.toString() : 'Unknown',
                total:      d.total,
                resolved:   d.resolved,
                pending:    d.pending,
                inProgress: d.inProgress,
                score:      calcScore(d.resolved, d.total),
                badges:     calcBadges(d.resolved)
            }))
        });
    } catch (err) {
        console.error('Citizen dashboard error:', err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET /api/dashboard/collector
// @desc    Get collector dashboard stats and pickups
// @access  Private (Collector)
router.get('/collector', auth, async (req, res) => {
    console.log(`[DEBUG] HIT /api/dashboard/collector - User: ${req.user.id}, Role: ${req.user.role}`);
    
    const userRole = (req.user.role || '').toLowerCase();
    if (userRole !== 'swachhta mitra' && userRole !== 'collector') {
        console.warn(`[DEBUG] Role Check FAILED: "${userRole}"`);
        return res.status(403).json({ message: 'Access denied: Requires Collector role' });
    }

    try {
        const mongoose = require('mongoose');
        const userId = req.user.id;
        
        // Ensure we handle potential ObjectId conversion safely
        if (!mongoose.isValidObjectId(userId)) {
            console.error(`[API] Invalid User ID format: ${userId}`);
            return res.status(400).json({ message: 'Error: User ID format is invalid' });
        }

        const collectorObjId = new mongoose.Types.ObjectId(userId);
        console.log(`[DEBUG] Fetching User Profile for ID: ${collectorObjId}`);
        const user = await User.findById(collectorObjId).lean();
        
        if (!user) {
            return res.status(404).json({ message: 'Collector profile not found' });
        }

        if (!user.zone) {
            console.warn(`[API] Collector ${userId} has no assigned zone`);
            // Instead of error, return empty state data so UI doesn't crash but shows 0s
            return res.json({
                stats: { assigned: 0, completed: 0, pending: 0, inProgress: 0, totalScore: 0, dailyScore: 0, totalBadges: 0, totalReports: 0, completionRate: 0 },
                pickups: [],
                dailyStats: [],
                monthlyStats: [],
                yearlyStats: []
            });
        }

        const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        
        // Use exact match for zone to leverage index maximum speed
        const cleanZone = (user.zone || "").trim();
        const zoneQuery = { zone: cleanZone };
        console.log(`[DEBUG] Zone Querying: "${cleanZone}"`);

        // Fetch Everything in PARALLEL with ultra-fast lean queries
        const [zoneCounts, pickups, dailyStats, monthlyStats, yearlyStats] = await Promise.all([
            Report.aggregate([
                { $match: { ...zoneQuery, status: { $ne: 'Rejected' } } },
                { $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }}
            ]),
            Report.find(zoneQuery, { photos: { $slice: 1 } }).sort({ createdAt: -1 }).limit(10).lean(),
            Report.aggregate([
                { $match: { ...zoneQuery, createdAt: { $gte: thirtyDaysAgo } } },
                { $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total:      { $sum: 1 },
                    resolved:   { $sum: { $cond: [{ $eq: ["$status", "Resolved"]    }, 1, 0] } },
                    pending:    { $sum: { $cond: [{ $eq: ["$status", "Pending"]     }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } }
                }},
                { $sort: { "_id": 1 } }
            ]),
            Report.aggregate([
                { $match: { ...zoneQuery, createdAt: { $gte: startOfYear } } },
                { $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    total:      { $sum: 1 },
                    resolved:   { $sum: { $cond: [{ $eq: ["$status", "Resolved"]    }, 1, 0] } },
                    pending:    { $sum: { $cond: [{ $eq: ["$status", "Pending"]     }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } }
                }},
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]),
            Report.aggregate([
                { $match: zoneQuery },
                { $group: {
                    _id: { $year: "$createdAt" },
                    total:      { $sum: 1 },
                    resolved:   { $sum: { $cond: [{ $eq: ["$status", "Resolved"]    }, 1, 0] } },
                    pending:    { $sum: { $cond: [{ $eq: ["$status", "Pending"]     }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } }
                }},
                { $sort: { "_id": 1 } }
            ])
        ]);
        console.log(`[DEBUG] Aggregations Success. zoneCounts Length: ${zoneCounts.length}`);

        // Parse zone counts
        const [totalBadges, userProfile] = await Promise.all([
            UserBadge.countDocuments({ userId: collectorObjId }),
            User.findById(collectorObjId).lean()
        ]);

        const getCount = (status) => (zoneCounts.find(c => c._id === status)?.count || 0);
        const assigned = zoneCounts.reduce((acc, curr) => acc + curr.count, 0);
        const completed = getCount('Resolved');
        const pending = getCount('Pending');
        const inProgress = getCount('In Progress');

        // 🔥 Instant Reset Logic: If last update was before today, daily is 0
        const isSameDay = userProfile?.lastScoreUpdate && 
                         new Date(userProfile.lastScoreUpdate).toDateString() === new Date().toDateString();
        
        const totalScore = userProfile?.totalScore || 0;
        const dailyScore = isSameDay ? (userProfile?.dailyScore || 0) : 0;

        const completionRate = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;

        res.json({
            stats: { 
                assigned, 
                completed, 
                pending, 
                inProgress,
                totalScore,
                dailyScore,
                totalBadges,
                totalReports: assigned,
                completionRate
            },
            pickups,
            dailyStats: dailyStats.map(d => ({
                name: d._id || 'Unknown',
                total: d.total,
                resolved: d.resolved,
                pending: d.pending || 0,
                inProgress: d.inProgress || 0,
                score: calcScore(d.resolved, d.total),
                badges: calcBadges(d.resolved)
            })),
            monthlyStats: monthlyStats.map(d => ({
                name: d._id ? `${d._id.year}-${String(d._id.month).padStart(2, '0')}` : 'Unknown',
                total: d.total,
                resolved: d.resolved,
                pending: d.pending || 0,
                inProgress: d.inProgress || 0,
                score: calcScore(d.resolved, d.total),
                badges: calcBadges(d.resolved)
            })),
            yearlyStats: yearlyStats.map(d => ({
                name: d._id ? d._id.toString() : 'Unknown',
                total: d.total,
                resolved: d.resolved,
                pending: d.pending || 0,
                inProgress: d.inProgress || 0,
                score: calcScore(d.resolved, d.total),
                badges: calcBadges(d.resolved)
            }))
        });
    } catch (err) {
        console.error('Collector dashboard error:', err.message);
        res.status(500).send(err.stack || err.message);
    }
});

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard stats and problem areas
// @access  Private (Admin)
router.get('/admin', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const total = await Report.countDocuments();
        const resolved = await Report.countDocuments({ status: 'Resolved' });
        const pending = await Report.countDocuments({ status: 'Pending' });
        
        const User = require('../models/User');
        const collectorsCount = await User.countDocuments({ role: { $in: ['Swachhta Mitra', 'collector'] } });

        // Get problem areas using aggregation
        const problemAreas = await Report.aggregate([
            { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
            { $group: { _id: "$location", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Get zone efficiency for admin sidebar
        const zoneStats = await Report.aggregate([
            { $group: { 
                _id: "$zone", 
                total: { $sum: 1 }, 
                resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } } 
            }},
            { $project: {
                zone: "$_id",
                efficiency: { $multiply: [{ $divide: ["$resolved", "$total"] }, 100] }
            }}
        ]);

        res.json({
            stats: { total, resolved, pending, collectorsCount },
            problemAreas: problemAreas.map(item => ({ location: item._id, count: item.count })),
            zoneStats
        });
    } catch (err) {
        console.error('Admin dashboard error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
