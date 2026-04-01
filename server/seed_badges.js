const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Badge = require('./models/Badge');

dotenv.config();

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

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Seeding...');

    const initialBadges = badgeNames.map((name, i) => ({
      name,
      description: `Elite Milestone: Resolve ${(i + 1) * 2} reports to earn the prestigious ${name} badge and +100 bonus reward points.`,
      icon: 'Award',
      conditionType: 'resolved_reports',
      conditionValue: (i + 1) * 2
    }));

    await Badge.deleteMany();
    await Badge.insertMany(initialBadges);

    console.log(`✅ ${initialBadges.length} BADGES SEEDED SUCCESSFULLY`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
