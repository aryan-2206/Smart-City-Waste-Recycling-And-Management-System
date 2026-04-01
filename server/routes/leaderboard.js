const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Report = require('../models/Report');
const UserBadge = require('../models/UserBadge');
const auth = require('../middleware/auth');

// @route   GET /api/leaderboard
// @desc    Get top users based on reward points and performance
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Start time for "today"
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const leaderboard = await User.aggregate([
            // 🚀 STEP 1: Fast sort by totalScore and limit to 100
            { $sort: { totalScore: -1 } },
            { $limit: 100 },

            // 🚀 STEP 2: Lookup Reports (Citizen Role)
            {
                $lookup: {
                    from: 'reports',
                    localField: '_id',
                    foreignField: 'citizenId',
                    as: 'citizenReports'
                }
            },

            // 🚀 STEP 3: Lookup Reports (Collector Role)
            {
                $lookup: {
                    from: 'reports',
                    localField: '_id',
                    foreignField: 'collectorId',
                    as: 'collectorReports'
                }
            },

            // 🚀 STEP 4: Lookup Badges
            {
                $lookup: {
                    from: 'userbadges',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'badges'
                }
            },

            // 🚀 STEP 5: Calculate Stats in-pipeline (Unique resolved reports)
            {
                $addFields: {
                    totalReports: { $size: "$citizenReports" },
                    resolvedReports: {
                        $size: {
                            $filter: {
                                input: { $setUnion: ["$citizenReports", "$collectorReports"] },
                                as: "rep",
                                cond: { $eq: ["$$rep.status", "Resolved"] }
                            }
                        }
                    },
                    badgeCount: { $size: "$badges" },
                    isSameDay: {
                        $cond: [
                            { $eq: ["$lastScoreUpdate", null] },
                            false,
                            { $eq: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$lastScoreUpdate" } },
                                { $dateToString: { format: "%Y-%m-%d", date: today } }
                            ]}
                        ]
                    }
                }
            },

            // 🚀 STEP 6: Final Projection (Format for UI)
            {
                $project: {
                    id: "$_id",
                    name: 1,
                    role: 1,
                    avatar: 1,
                    totalScore: { $ifNull: ["$totalScore", 0] },
                    dailyScore: {
                        $cond: [{ $eq: ["$isSameDay", true] }, { $ifNull: ["$dailyScore", 0] }, 0]
                    },
                    totalReports: 1,
                    resolvedReports: 1,
                    badgeCount: 1,
                    successRate: {
                        $cond: [
                            { $gt: ["$totalReports", 0] },
                            { $round: [{ $multiply: [{ $divide: ["$resolvedReports", "$totalReports"] }, 100] }, 0] },
                            0
                        ]
                    }
                }
            }
        ]);

        res.json(leaderboard);
    } catch (err) {
        console.error('Leaderboard API Error:', err.message);
        res.status(500).json({ message: 'Server Error: Failed to fetch leaderboard' });
    }
});

module.exports = router;
