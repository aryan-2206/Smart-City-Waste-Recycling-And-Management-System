import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Trophy, Award, Star, Zap, Shield, Target, Flame, Heart, Leaf, Recycle, 
    CheckCircle, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';

const Badges = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({ resolved: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard/citizen', {
                    headers: { 'x-auth-token': token }
                });
                setStats({ resolved: res.data?.stats?.resolved || 0 });
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };
        if (token) fetchStats();
    }, [token]);

    // Unlocking 1 badge for every 2 resolved reports, up to 100
    const unlockedCount = Math.min(Math.floor(stats.resolved / 2), 100);

    const badgeNames = [
        "First Step", "Clean Starter", "Eco Warrior", "Waste Ninja", "City Helper",
        "Green Citizen", "Recycle Pro", "Sustainability Hero", "Earth Guard", "Nature Friend",
        "Community Star", "Clean Streets", "Green Impact", "Eco Legend", "Waste Buster",
        "Planet Saver", "Pure Heart", "Green Visionary", "City Guardian", "Eco Champion",
        "Neighborhood Hero", "Pollution Fighter", "Sky Watcher", "Water Protector", "Seed Sower",
        "Flower Power", "Forest Keeper", "Garden Sage", "Tree Hugger", "Leaf Specialist",
        "Climate Pilot", "Ocean Saver", "Reef Rescuer", "Beach Cleaner", "Stream Savior",
        "Mountain Guide", "Hillside Guard", "Plain Protector", "Ice Defender", "Arctic Hero",
        "Desert Guard", "Mist Master", "Wind Whisperer", "Solar Seeker", "Lunar Light",
        "Stellar Eco", "Galaxy Guard", "Universal Clean", "Infinity Impact", "Life Bringer",
        "Oxygen Expert", "Carbon Cutter", "Smog Smacker", "Toxin Terminator", "Hazard Hunter",
        "Bottle Baron", "Cardboard King", "Plastic Pirate", "Metal Master", "Glass Genius",
        "Organic Oracle", "Compost Captain", "Zero Hero", "Minimalist Master", "Circular Savvy",
        "Ethical Expert", "Fair Follower", "Kind Keeper", "Smart Strategist", "Clean Catalyst",
        "Spark of Hope", "Beam of Light", "Glow of Earth", "Radiant Runner", "Dazzling Defender",
        "Polished Patriot", "Shining Soul", "Eco Essence", "Nature Nurturer", "Wild Warden",
        "Animal Ally", "Bird Buddy", "Bug Boss", "Fish Friend", "Whale Watcher",
        "Tiger Trust", "Lion Loyal", "Eagle Eye", "Wolf Wisdom", "Panda Peace",
        "Green Giant", "Earth Emperor", "Biosphere Boss", "Gaia Guardian", "Eden Expert",
        "Paradise Planner", "Utopia Unit", "Nature Nexus", "World Wonder", "The Ultimate Green"
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in text-slate-800 dark:text-slate-100">
            <PageHeader title="Eco Achievements" subtitle={`You have unlocked ${unlockedCount} / 100 Badges`} icon={Trophy} />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
                {badgeNames.map((name, i) => {
                    const isUnlocked = i < unlockedCount;
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

export default Badges;
