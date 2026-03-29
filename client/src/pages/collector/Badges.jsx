import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Truck, Award, Star, Zap, Shield, Target, Flame, Heart, Leaf, Recycle, 
    CheckCircle, Lock, Trophy, MapPin, Navigation, Map, Ruler, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';

const CollectorBadges = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({ completed: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard/collector', {
                    headers: { 'x-auth-token': token }
                });
                setStats({ completed: res.data?.stats?.completed || 0 });
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };
        if (token) fetchStats();
    }, [token]);

    const unlockedCount = Math.floor(stats.completed / 2);

    const badgeNames = [
        "First Pickup", "Route Rookie", "Street Saver", "Bin Buster", "Swift Sweeper",
        "Clean Captain", "Waste Wizard", "Truck Titan", "Haul Hero", "Eco Picker",
        "Zone Master", "Alley Ally", "Pavement Pilot", "Track Tracer", "Sector Sentinel",
        "Neighborhood Knight", "District Defender", "Urban Uplifter", "City Cycler", "Green Gear",
        "Efficient Hauler", "Rapid Responder", "Direct Driver", "Service Star", "Public Protector",
        "Duty Defender", "Mission Mapper", "Task Terminator", "Job Giant", "Reliable Runner",
        "Speedy Savior", "Always Alerts", "Perfect Pickup", "Graceful Gear", "Steady Steer",
        "Safe Streets", "Pure Path", "Clean Crawler", "Metal Master", "Organic Orbit",
        "Plastic Professional", "Paper Patriot", "Glass Guardian", "Cardboard King", "Bottle Baron",
        "Eco Engine", "Zero Zenith", "Sustainable Steer", "Green Glide", "Earth Engine",
        "Climate Crew", "Verve Van", "Turbo Truck", "Elite Eco", "Grand Gear",
        "Super Sweeper", "Apex Ally", "Prime Picker", "Ultra Uplift", "Final Frontier",
        "Route Ranger", "Nav Master", "Precision Pilot", "Compass King", "Atlas Ace",
        "Globe Guard", "Eco Expert", "Waste Warden", "Pollution Police", "Cleanup Commando",
        "Bio Baron", "Green General", "Trash Terminator", "Eco Emperor", "Nature Knight",
        "Wild Warden", "Field Friend", "Trail Blazer", "Path Picker", "Sky Sailor",
        "Ocean Orbit", "Reef Ranger", "Beach Boss", "Sand Saver", "River Runner",
        "Creek Captain", "Stream Soul", "Current Cleaner", "Flow Finder", "Pure Pilot",
        "Green Giant", "Eco Elite", "World Watcher", "Gaia Guard", "Eden Engine",
        "Legendary Loader", "Titan of Trash", "Clean Overlord", "Supreme Savior", "Eco Absolute"
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in text-slate-800 dark:text-slate-100">
            <PageHeader title="Eco Achievements" subtitle={`You have unlocked ${unlockedCount} Badges`} icon={Trophy} />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
                {badgeNames.map((name, i) => {
                    const isUnlocked = stats.completed >= (i + 1) * 2;
                    return (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] flex items-center justify-center text-3xl mb-4 transition-all duration-300 relative border-2 ${
                                isUnlocked 
                                ? "bg-emerald-100/50 dark:bg-emerald-500/10 border-emerald-500 shadow-md scale-100" 
                                : "bg-slate-50 dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 opacity-40"
                            }`}>
                                <Trophy size={36} className={isUnlocked ? "text-emerald-500" : "text-slate-300"} />
                                {isUnlocked && <CheckCircle className="absolute -top-1 -right-1 text-emerald-500 bg-white rounded-full p-0.5" size={24} />}
                                {!isUnlocked && <Lock className="absolute top-3 right-3 text-slate-300" size={14} />}
                            </div>
                            <h4 className={`text-[12px] sm:text-sm font-bold capitalize leading-tight ${isUnlocked ? "text-slate-800 dark:text-slate-100" : "text-slate-400"}`}>
                                {name.toLowerCase()}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">
                                {isUnlocked ? "Unlocked" : `Resolve ${ (i + 1) * 2 }`}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CollectorBadges;
