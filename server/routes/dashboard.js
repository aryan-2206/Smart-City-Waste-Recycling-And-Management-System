const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// @route   GET /api/dashboard/citizen
// @desc    Get citizen dashboard stats and recent reports
// @access  Private (Citizen)
router.get('/citizen', auth, async (req, res) => {
    if (req.user.role !== 'citizen') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const citizenObjId = new mongoose.Types.ObjectId(req.user.id);

        const total      = await Report.countDocuments({ citizenId: citizenObjId });
        const resolved   = await Report.countDocuments({ citizenId: citizenObjId, status: 'Resolved' });
        const pending    = await Report.countDocuments({ citizenId: citizenObjId, status: 'Pending' });
        const inProgress = await Report.countDocuments({ citizenId: citizenObjId, status: 'In Progress' });

        const recentReports = await Report.find({ citizenId: citizenObjId })
            .sort({ createdAt: -1 })
            .limit(5);

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

        const calcScore  = (r, t) => (r * 100) + ((t - r) * 10);
        const calcBadges = (r)    => r > 0 ? Math.floor(r / 2) + 1 : 0;

        res.json({
            stats,
            recentReports,
            dailyStats: dailyStats.map(d => ({
                name:       d._id,
                total:      d.total,
                resolved:   d.resolved,
                pending:    d.pending,
                inProgress: d.inProgress,
                score:      calcScore(d.resolved, d.total),
                badges:     calcBadges(d.resolved)
            })),
            monthlyStats: monthlyStats.map(d => ({
                name:       `${d._id.year}-${String(d._id.month).padStart(2, '0')}`,
                total:      d.total,
                resolved:   d.resolved,
                pending:    d.pending,
                inProgress: d.inProgress,
                score:      calcScore(d.resolved, d.total),
                badges:     calcBadges(d.resolved)
            })),
            yearlyStats: yearlyStats.map(d => ({
                name:       d._id.toString(),
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
    if (req.user.role !== 'collector') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        // Find the user to get their zone
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        
        if (!user.zone) {
            return res.status(400).json({ message: 'Collector has no assigned zone' });
        }

        const collectorObjId = new mongoose.Types.ObjectId(req.user.id);

        const assigned = await Report.countDocuments({ zone: user.zone });
        const completed = await Report.countDocuments({ collectorId: req.user.id, status: 'Resolved' });
        const pending = await Report.countDocuments({ zone: user.zone, status: 'Pending' });

        const pickups = await Report.find({ zone: user.zone })
            .sort({ createdAt: -1 });

        // Daily Stats aggregation for Collector Impact
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dailyStats = await Report.aggregate([
            { $match: { collectorId: collectorObjId, updatedAt: { $gte: thirtyDaysAgo }, status: 'Resolved' } },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                total:      { $sum: 1 },
                resolved:   { $sum: 1 },
                pending:    { $sum: 0 },
                inProgress: { $sum: 0 }
            }},
            { $sort: { "_id": 1 } }
        ]);

        // Monthly Stats
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const monthlyStats = await Report.aggregate([
            { $match: { collectorId: collectorObjId, updatedAt: { $gte: startOfYear }, status: 'Resolved' } },
            { $group: {
                _id: { year: { $year: "$updatedAt" }, month: { $month: "$updatedAt" } },
                total:      { $sum: 1 },
                resolved:   { $sum: 1 },
                pending:    { $sum: 0 },
                inProgress: { $sum: 0 }
            }},
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Yearly Stats
        const yearlyStats = await Report.aggregate([
            { $match: { collectorId: collectorObjId, status: 'Resolved' } },
            { $group: {
                _id: { $year: "$updatedAt" },
                total:      { $sum: 1 },
                resolved:   { $sum: 1 },
                pending:    { $sum: 0 },
                inProgress: { $sum: 0 }
            }},
            { $sort: { "_id": 1 } }
        ]);

        const calcScore  = (r) => r * 100;
        const calcBadges = (r) => r > 0 ? Math.floor(r / 2) + 1 : 0;

        res.json({
            stats: { assigned, completed, pending },
            pickups,
            dailyStats: dailyStats.map(d => ({
                name: d._id,
                total: d.total,
                resolved: d.resolved,
                pending: d.pending || 0,
                inProgress: d.inProgress || 0,
                score: calcScore(d.resolved),
                badges: calcBadges(d.resolved)
            })),
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
        });
    } catch (err) {
        console.error('Collector dashboard error:', err.message);
        res.status(500).send('Server Error');
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
        const collectorsCount = await User.countDocuments({ role: 'collector' });

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
