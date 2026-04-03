# 🌿 EcoPulse — Smart Waste Management System

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js"/>
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css"/>
</p>

---

## 🌟 What is EcoPulse?

Keeping our cities clean shouldn't be complicated. Right now, if you see garbage on the street, there is no quick way to report it. At the same time, waste collectors don't always know exactly where their help is needed most.

**EcoPulse** fixes this. It is a smart, easy-to-use platform that connects **Citizens**, and **Waste Collectors (Swachhta Mitras)**, all in one place. By using technology, we turn city cleaning into a fast, organized, and teamwork-driven process. It is a full-stack MERN application designed for real-world impact.

---

## 🚀 How It Works (The 5-Step Flow)

We designed the system to be so simple that anyone can use it:

1. **🔐 Easy Login**: Sign in safely using your Email or Google account. The system automatically knows if you are a Citizen, a Collector, or an Admin (Role-Based Access).
2. **📸 Snap & Report**: See a pile of garbage? Just click a photo, share the location, and submit your report in seconds.
3. **🤖 Smart Routing**: The system does the heavy lifting. It automatically finds the nearest waste collector in that specific zone and alerts them.
4. **🧹 Quick Action**: The collector gets the task on their phone, goes to the location, cleans it, and updates the status to "Resolved".
5. **🏅 Earn Rewards**: Citizens get a live update that their area is clean, plus they earn fun points and **Badges** (like "Clean Zone Hero") for being responsible.

---

## 🔥 Key Features (Premium UI)

| Feature | What It Means For You |
| :--- | :--- |
| **📊 Glassmorphic Dashboard** | A beautiful, modern screen that shows live updates, progress, and daily stats. |
| **📍 Geo-Precision Reports** | Upload photos with exact locations so no garbage is left hidden. |
| **🚛 Collector Portal** | A special mobile-friendly view for workers to easily manage their daily tasks. |
| **🛡️ Admin Command Center** | A master control room for city officials to manage users and monitor cleanliness. |
| **🏆 Reward System** | We make cleaning fun! Users earn badges and points for being responsible. |
| **📈 Professional Analytics** | Easy-to-read charts (Recharts) that show waste trends and resolution rates. |
| **🔔 Instant Notifications** | Get an alert the second your report is accepted or marked as cleaned. |

---

## 🛠️ Technologies Used

> **Built with a focus on speed, security, and a professional look:**

* **Frontend:** React.js (Vite) — *For a super fast user experience.*
* **Animations:** Framer Motion — *For smooth, premium UI transitions.*
* **Styling:** Tailwind CSS — *For a clean, modern, and mobile-responsive design.*
* **Backend:** Node.js & Express.js — *A robust API to handle reports and users.*
* **Database:** MongoDB Atlas — *Cloud-based storage for all city data.*
* **Security:** JWT & Bcrypt — *To keep user accounts and passwords 100% safe.*
* **State Management:** React Context API — *To manage user sessions seamlessly.*

---

## 📂 Project Architecture

```text
EcoPulse/
 ├── client/          # Everything the user sees (React + Vite)
 │    ├── src/        # UI components, pages, and logic
 │    └── public/     # Static assets and icons
 ├── server/          # The brain of the app (Node.js)
 │    ├── models/     # Database structure (User, Report, Badge)
 │    ├── routes/     # API Endpoints (Auth, Reports, Analytics)
 │    └── middleware/ # Security & Role-based checks
 └── package.json     # Project dependencies
````

-----

## ⚙️ Installation & Setup

### 1\. Clone the Repository

```bash
git clone [https://github.com/gauravpatil-06/EcoPulse.git](https://github.com/gauravpatil-06/EcoPulse.git)
cd EcoPulse
```

### 2\. Install Dependencies

```bash
# Setup the backend
cd server
npm install

# Setup the frontend
cd ../client
npm install
```

### 3\. Environment Configuration

Create a `.env` file in the **server** folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_hyper_secure_password
GOOGLE_CLIENT_ID=your_google_auth_id
```

### 4\. Run the Project

```bash
# From the root folder
npm run dev
```

-----

## 🛡️ Security & Performance

  * **Role-Based Access (RBAC)**: Admins, Collectors, and Citizens see only what they are allowed to see.
  * **Encrypted Data**: All passwords are hashed using Bcrypt before being stored.
  * **Fast Loading**: Used **Lazy Loading** and optimized API calls to keep the dashboard snappy.
  * **Responsive Design**: Works perfectly on mobile phones, tablets, and laptops.

-----

## 🚧 Challenges We Solved

  * **Real-Time Sync**: We implemented a system that updates the citizen's report status instantly when a collector finishes their work.
  * **Role Routing**: Built a custom layout engine that dynamically changes the sidebar and navigation based on the user's role.
  * **Data Clarity**: Used **Recharts** to turn thousands of database entries into simple, visual growth charts for city admins.

-----

## 👥 The Team

  * **Gaurav Patil** — Lead Developer
  * **Abhishek Survase**
  * **Suraj Desale**
  * **Snehal Aakhud**
  * **Vaishnavi Badgujar**

-----

> *"EcoPulse was built from scratch to solve a real friction in urban life. It's not just code; it's a working system designed to make our environment better through technology."*

-----

\<div align="center"\>

**🌐 [Live Web App](https://ecopulsex.vercel.app/)**

✨ **Report. Resolve. Reward. Making our cities cleaner and smarter.**

\</div\>
