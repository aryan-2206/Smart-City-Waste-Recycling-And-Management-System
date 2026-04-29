# 🌿 Nivaran — Smart City Waste Management System 

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js"/>
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/badge/Styling-Tailwind%20%7C%20Framer%20Motion-38B2AC?style=for-the-badge&logo=tailwind-css"/>
</p>

---

## 🌟 Project Overview

**Nivaran** (codename: EcoPulse) is a comprehensive smart city waste management system designed to bridge the communication gap between citizens, waste collectors (Swachhta Mitras), and municipal administrators. The platform transforms city cleaning into a fast, organized, and collaborative process through modern technology.

### 🎯 Problem Statement
Municipal waste management in Indian cities suffers from a fundamental communication gap. Citizens have no efficient channel to report garbage accumulation, and waste collectors have no structured system to receive, prioritize, and track cleanup tasks. This results in uncleansed public areas, delayed response times, and zero civic accountability.

### ✨ Solution
A role-aware, community-driven platform that enables:
- **Fast, photo-based garbage reporting** with automatic zone tagging
- **Automated task assignment** to the correct Swachhta Mitra based on zone
- **Full lifecycle tracking** with real-time notifications
- **Gamification system** with points, badges, leaderboard, and redeemable rewards
- **Real-time analytics** and comprehensive user management control

---

## 🚀 The 5-Step Smart Workflow

1. **🔐 Easy Login**  
   Users register/login via Email+Password or Google OAuth 2.0, selecting their role (Citizen, Swachhta Mitra, or Admin).

2. **📸 Smart Reporting**  
   Citizens submit garbage reports with photos, garbage type, location, and urgency level.

3. **🤖 Automatic Assignment**  
   System performs city+zone matching to find relevant Swachhta Mitras and dispatches notifications instantly.

4. **🧹 Quick Action**  
   Swachhta Mitras accept tasks, upload evidence photos, and mark reports as resolved.

5. **🏅 Rewards & Updates**  
   Both citizen and collector earn points and badges upon resolution, reflected on the public leaderboard.

---

## 📁 Complete File Structure

```
waste_management_github/
├── 📄 Community_Project_Report_FULL.txt     # Detailed project documentation
├── 📄 README.md                              # This file
└── 📁 EcoPulse/                              # Main application directory
    ├── 📄 .gitignore                         # Git ignore rules
    ├── 📄 README.md                          # Original project README
    ├── 📁 .git/                              # Git repository
    ├── 📁 client/                            # Frontend React application
    │   ├── 📄 package.json                   # Frontend dependencies
    │   ├── 📄 package-lock.json              # Locked dependencies
    │   ├── 📄 index.html                     # HTML template
    │   ├── 📄 vite.config.js                 # Vite configuration
    │   ├── 📄 tailwind.config.cjs            # Tailwind CSS config
    │   ├── 📄 postcss.config.cjs             # PostCSS configuration
    │   ├── 📄 vercel.json                    # Vercel deployment config
    │   ├── 📁 public/                        # Static assets
    │   ├── 📁 src/                           # Source code
    │   │   ├── 📄 main.jsx                   # React entry point
    │   │   ├── 📄 App.jsx                    # Root component with routing
    │   │   ├── 📄 index.css                  # Global styles
    │   │   ├── 📁 components/                # Reusable components
    │   │   │   ├── 📄 Navbar.jsx             # Navigation bar
    │   │   │   ├── 📄 ProtectedRoute.jsx     # Route protection
    │   │   │   ├── 📄 GoogleAuthButton.jsx   # Google OAuth button
    │   │   │   ├── 📄 PageHeader.jsx         # Page header component
    │   │   │   ├── 📄 ResetPasswordModal.jsx # Password reset modal
    │   │   │   └── 📁 layout/                # Layout components
    │   │   │       ├── 📄 ModuleLayout.jsx   # Module wrapper layout
    │   │   │       └── 📄 ModuleSidebar.jsx  # Dynamic sidebar
    │   │   ├── 📁 context/                   # React Context providers
    │   │   │   ├── 📄 AuthContext.jsx        # Authentication state
    │   │   │   └── 📄 ThemeContext.jsx       # Theme management
    │   │   ├── 📁 pages/                     # Page components
    │   │   │   ├── 📄 Home.jsx               # Public landing page
    │   │   │   ├── 📄 Auth.jsx               # Login/Signup page
    │   │   │   ├── 📄 Leaderboard.jsx        # Public leaderboard
    │   │   │   ├── 📁 citizen/               # Citizen-specific pages
    │   │   │   │   ├── 📄 Dashboard.jsx      # Citizen dashboard
    │   │   │   │   ├── 📄 SubmitReport.jsx   # Report creation form
    │   │   │   │   ├── 📄 MyReports.jsx       # User's reports
    │   │   │   │   ├── 📄 Notifications.jsx  # Notification inbox
    │   │   │   │   ├── 📄 Badges.jsx          # Badge collection
    │   │   │   │   └── 📄 Profile.jsx         # Profile management
    │   │   │   ├── 📁 collector/             # Collector-specific pages
    │   │   │   │   ├── 📄 Dashboard.jsx      # Collector dashboard
    │   │   │   │   ├── 📄 Pickups.jsx         # Task management
    │   │   │   │   ├── 📄 Notifications.jsx  # Notification inbox
    │   │   │   │   └── 📄 Badges.jsx          # Badge collection
    │   │   │   └── 📁 admin/                 # Admin-specific pages
    │   │   │       ├── 📄 Dashboard.jsx      # Admin dashboard
    │   │   │       ├── 📄 Reports.jsx         # Report management
    │   │   │       ├── 📄 Users.jsx           # User management
    │   │   │       └── 📄 SelectionPage.jsx   # Admin module selection
    │   │   ├── 📁 hooks/                     # Custom React hooks
    │   │   │   └── 📄 useDebounce.js         # Debounce utility hook
    │   │   └── 📁 utils/                     # Utility functions
    │   │       └── 📄 imageUtils.js          # Image processing utilities
    │   └── 📁 dist/                           # Build output directory
    └── 📁 server/                            # Backend Node.js application
        ├── 📄 package.json                   # Backend dependencies
        ├── 📄 package-lock.json              # Locked dependencies
        ├── 📄 server.js                      # Express server entry point
        ├── 📄 .env                           # Environment variables
        ├── 📁 middleware/                    # Express middleware
        │   └── 📄 auth.js                    # JWT authentication middleware
        ├── 📁 models/                        # MongoDB schemas
        │   ├── 📄 User.js                    # User schema (citizens/collectors)
        │   ├── 📄 Admin.js                   # Admin schema
        │   ├── 📄 Report.js                  # Report schema
        │   ├── 📄 Badge.js                   # Badge schema
        │   ├── 📄 UserBadge.js               # User-badge junction schema
        │   └── 📄 Notification.js            # Notification schema
        ├── 📁 routes/                        # API route handlers
        │   ├── 📄 auth.js                    # Authentication endpoints
        │   ├── 📄 reports.js                 # Report CRUD operations
        │   ├── 📄 dashboard.js               # Dashboard data endpoints
        │   ├── 📄 admin.js                   # Admin management endpoints
        │   ├── 📄 analytics.js               # Analytics endpoints
        │   ├── 📄 badges.js                  # Badge management
        │   ├── 📄 leaderboard.js             # Leaderboard data
        │   ├── 📄 notifications.js           # Notification management
        │   └── 📄 rewards.js                 # Reward system endpoints
        └── 📁 utils/                         # Utility functions
            ├── 📄 badgeHandler.js            # Badge award logic
            └── 📄 sendEmail.js               # Email sending utilities
```

---

## 🛠️ Detailed Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | ^18.3.1 | Core UI library (Component-based SPA) |
| Vite | ^5.3.1 | Build tool and dev server (ESM, fast HMR) |
| React Router DOM | ^6.23.1 | Client-side routing and protected routes |
| Tailwind CSS | ^3.4.4 | Utility-first CSS framework for styling |
| Framer Motion | ^12.38.0 | Animation library for glassmorphic UI |
| Recharts | ^3.8.0 | Interactive charts for analytics dashboards |
| Axios | ^1.7.2 | HTTP client for API communication |
| Lucide React | ^0.395.0 | SVG icon library |
| React Hot Toast | ^2.6.0 | Toast notification system |
| @react-oauth/google | ^0.13.4 | Google OAuth 2.0 integration component |
| PostCSS | ^8.4.38 | CSS transformation toolchain |
| Autoprefixer | ^10.4.19 | CSS vendor prefix automation |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | LTS | JavaScript runtime for the server |
| Express.js | ^5.2.1 | Web framework for REST API routing |
| Mongoose | ^9.3.0 | MongoDB ODM for schema and query management |
| MongoDB Atlas | Cloud | NoSQL database with flexible document storage |
| JWT (jsonwebtoken) | ^9.0.3 | Stateless authentication token generation |
| Bcryptjs | ^3.0.3 | Password hashing (salt rounds: 10) |
| google-auth-library | ^10.6.2 | Server-side Google ID token verification |
| Nodemailer | ^8.0.4 | Email dispatch for password reset flows |
| CORS | ^2.8.6 | Cross-Origin Resource Sharing middleware |
| Cookie Parser | ^1.4.7 | Cookie parsing middleware |
| Dotenv | ^17.3.1 | Environment variable management (.env) |

### Deployment
| Platform | Purpose |
|----------|---------|
| Vercel | Frontend hosting (client/dist) |
| Render/Railway | Backend API hosting (Node.js) |
| MongoDB Atlas | Cloud database (free tier cluster) |

---

## 🗄️ Database Schema Details

### User Model (Users Collection)
- **Fields**: name, email, password, phone, role, zone, city, area, postalCode, avatar, isActive, lastLogin, rewardPoints, totalScore, dailyScore, lastScoreUpdate, resetPasswordToken, resetPasswordExpire, isGoogleAuth, headline, pronouns, school
- **Methods**: addPoints(), getResetPasswordToken()

### Admin Model (Admins Collection)
- Mirrors User model with role fixed to 'admin' and zone defaults to 'all'
- No gamification fields (rewardPoints, dailyScore, totalScore)

### Report Model (Reports Collection)
- **Fields**: citizenId, garbageType, location, city, zone, area, landmark, contactNumber, description, photos, urgency, status, collectorId, evidenceUploaded, initialPhotoCount
- **Indexes**: Optimized for zone+status queries, citizen reports, and collector assignments

### Badge Model (Badges Collection)
- **Fields**: name, description, icon, conditionType, conditionValue
- **Pre-seeded Badges**: First Reporter, Active Citizen, Eco Warrior, Problem Solver, Clean Zone Hero, City Legend

### UserBadge Model (UserBadges Collection)
- Junction table linking users to earned badges with timestamps

### Notification Model (Notifications Collection)
- **Fields**: user, report, title, message, type, points, isRead, createdAt
- **Types**: Status Update, New Task, Reward, Badge, New Assignment

---

## 🔧 API Endpoints Overview

### Authentication (`/api/auth/`)
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /google` - Google OAuth authentication
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `PUT /profile/avatar` - Update avatar
- `PUT /change-password` - Change password
- `POST /forgot-password` - Request password reset
- `PUT /reset-password/:token` - Reset password

### Reports (`/api/reports/`)
- `POST /` - Create new report
- `GET /` - Get reports with filters and pagination
- `GET /:id` - Get single report
- `PUT /:id` - Update report (citizen only)
- `DELETE /:id` - Delete report
- `PUT /:id/status` - Update report status

### Dashboard (`/api/dashboard/`)
- `GET /citizen` - Citizen dashboard data
- `GET /collector` - Collector dashboard data
- `GET /admin` - Admin dashboard data

### Admin (`/api/admin/`)
- `GET /users` - Get all users with filters
- `PUT /users/:id/status` - Toggle user status
- `PUT /users/:id/zone` - Update user zone
- `DELETE /users/:id` - Delete user

### Analytics (`/api/analytics/`)
- `GET /overview` - Admin analytics overview
- `GET /trends` - Monthly trends data

### Badges (`/api/badges/`)
- `GET /` - Get all badges
- `POST /seed` - Seed default badges

### Leaderboard (`/api/leaderboard/`)
- `GET /` - Get public leaderboard

### Notifications (`/api/notifications/`)
- `GET /` - Get user notifications
- `PUT /:id/read` - Mark notification as read
- `PUT /read-all` - Mark all as read
- `DELETE /clear-all` - Clear all notifications

### Rewards (`/api/rewards/`)
- `GET /catalog` - Get reward catalog
- `POST /redeem` - Redeem reward

---

## 🎮 Gamification System

### Scoring System
- **Submit a new report**: +10 points
- **Report gets resolved**: +50 points (citizen) + +50 points (collector)
- **Earn a badge**: +100 points per badge

### Badge Categories
- **Reporting Badges**: First Reporter, Active Citizen, Eco Warrior
- **Resolution Badges**: Problem Solver, Clean Zone Hero, City Legend
- **Special Badges**: Zone Hero, Streak Master

### Reward Catalog
- Eco-Friendly E-Certificate: 100 points
- Tree Planting in Your Name: 500 points
- SmartWaste Hero Badge (Exclusive): 1000 points
- 50% Discount Voucher - City Transit: 1500 points

---

## 🛡️ Security Features

### Authentication & Authorization
- **JWT-based authentication** with 24-hour expiry
- **Role-Based Access Control (RBAC)** middleware
- **Google OAuth 2.0** integration
- **Password hashing** with bcrypt (10 salt rounds)
- **Live user validation** in auth middleware

### Data Protection
- **Input validation** and sanitization
- **CORS configuration** with whitelist
- **Secure password reset** with SHA-256 token hashing
- **Zone-based data scoping** for role security

### Performance & Reliability
- **MongoDB indexing** for optimized queries
- **Lazy loading** for better performance
- **Debounced search** to reduce API calls
- **Mobile-first responsive design**

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (LTS version)
- MongoDB Atlas account
- Google OAuth 2.0 credentials

### 1. Clone the Repository
```bash
git clone https://github.com/aryan-2206/Smart-City-Waste-Recycling-And-Management-System.git
cd waste_management_github/EcoPulse
```

### 2. Install Dependencies
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_hyper_secure_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
FRONTEND_URL=your_deployed_frontend_url
```

### 4. Run the Application
```bash
# Start backend server
cd server
npm start

# Start frontend development server (in another terminal)
cd client
npm run dev
```

### 5. Build for Production
```bash
cd client
npm run build
```

---

## 📊 Key Features & Modules

### 🏠 Citizen Module
- **Smart Reporting**: Photo-based garbage reporting with automatic location detection
- **Report Tracking**: Full lifecycle tracking of submitted reports
- **Rewards System**: Points and badges for active participation
- **Notifications**: Real-time updates on report status

### 🧹 Swachhta Mitra Module
- **Task Management**: View and accept pickup requests in assigned zones
- **Evidence Upload**: Before/after photos for verification
- **Performance Tracking**: Personal dashboard with completion metrics
- **Zone-based Filtering**: Only see tasks in assigned areas

### 👨‍💼 Admin Module
- **User Management**: Activate/deactivate users, manage zones
- **Report Oversight**: View all reports with advanced filtering
- **Analytics Dashboard**: Comprehensive city-wide statistics and trends
- **System Control**: Full administrative control over the platform

### 🎯 Core Features
- **Glassmorphic UI**: Modern, animated interface using Framer Motion
- **Real-time Notifications**: Instant updates for all user actions
- **Responsive Design**: Mobile-first approach for all device sizes
- **Interactive Analytics**: Charts and graphs using Recharts
- **Public Leaderboard**: Gamification element to encourage participation

---

## 🏆 Project Outcomes & Impact

### Technical Achievements
- ✅ Fully functional 3-role web application deployed on Vercel
- ✅ Sub-second API response times with MongoDB optimization
- ✅ Automated badge award pipeline with real-time notifications
- ✅ Interactive admin analytics with multiple chart views
- ✅ Public leaderboard with timezone-aware scoring

### Community Impact
- 🌟 **Bridged Communication Gap**: Direct channel between citizens and waste collectors
- 🚀 **Improved Response Times**: Automated task assignment reduces delays
- 📈 **Increased Civic Participation**: Gamification encourages community involvement
- 🎯 **Enhanced Accountability**: Full tracking and audit trail for all activities
- 🏅 **Sustainable Behavior**: Rewards system promotes long-term engagement

---

## 👥 Development Team

- **Aryan Doshi** (GitHub: @aryan-2206)
  - Role: Full-Stack Developer
  - Focus: Backend architecture, database design, authentication system

- **Dhairya Dabi** (GitHub: @Dhairya211206)
  - Role: Full-Stack Developer
  - Focus: Frontend development, UI/UX design, state management

---

## 📝 License & Credits

This project is developed as part of a community initiative to improve municipal waste management systems. The codebase is open-source and available for educational and non-commercial use.

---

## 🤝 Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support & Contact

For any queries, support, or collaboration opportunities:
- **GitHub Issues**: Report bugs or request features
- **Email**: aryandoshi22@gmail.com, dhairya.dabi@gmail.com

---

<div align="center">

**🌍 Report. Resolve. Reward. Making our cities cleaner and smarter.**

**📁 [Live Demo](https://your-deployment-url.com)** | **📁 [Source Code](https://github.com/aryan-2206/Smart-City-Waste-Recycling-And-Management-System)**

</div>
