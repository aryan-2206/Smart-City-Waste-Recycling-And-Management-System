# 🌿 EcoPulse — Smart Waste Management System

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js"/>
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/badge/Styling-Tailwind%20%7C%20Framer--Motion-38B2AC?style=for-the-badge&logo=tailwind-css"/>
</p>

---

## 🌟 Overview

**EcoPulse** is an intelligent, full-stack ecosystem designed to bridge the gap between citizens, **Swachhta Mitras (Waste Collectors)**, and city administrators. Instead of relying on manual pickup schedules, EcoPulse empowers citizens to report real-time waste issues via geo-precision tagging and photo evidence.

This project transforms city cleanliness from a manual struggle into a data-driven, gamified community effort. It is a high-performance **MERN Stack** application built for real-world urban impact.

---

## 🚀 The 5-Step Smart Workflow

We have engineered a frictionless journey for all users:

1.  **🔐 Seamless Access**: Secure login via **Email** or **Google OAuth**. The system instantly identifies your role: **Citizen**, **Swachhta Mitra**, or **Admin**.
2.  **📸 Precision Reporting**: Citizens capture a photo of the garbage, add a description, and the system automatically tags the **GPS Location**.
3.  **🤖 Smart Orchestration**: Our backend logic assigns the report to the specific **Zone** and alerts the designated **Swachhta Mitra** immediately.
4.  **🧹 Efficient Resolution**: The **Swachhta Mitra** views assigned tasks on their mobile-friendly portal, cleans the area, and marks the task as **Resolved**.
5.  **🏅 Civic Rewards**: Once verified, the citizen is notified and earns **Points & Badges** (like *Clean Zone Hero*) for their contribution.

---

## 🔥 Core Features (Premium Experience)

| Feature | Description |
| :--- | :--- |
| **📊 Glassmorphic Dashboard** | A premium, semi-transparent UI providing real-time stats and system overview. |
| **📍 Geo-Precision Engine** | Accurate reporting using location metadata and image uploads. |
| **🚛 Swachhta Mitra Portal** | A specialized workflow for collectors to accept, track, and complete cleaning tasks. |
| **🛡️ Global Command Center** | Full-scale Admin control to manage users, monitor reports, and verify city zones. |
| **🏆 Consistency Engine** | Gamified reward system with automated badge logic to increase engagement. |
| **📈 Live Analytics** | Interactive **Recharts** visualizing waste trends and resolution efficiency. |
| **🔔 Push Notifications** | Real-time alerts for status changes and new task assignments. |

---

## 🛠️ Tech Stack & Tools

> **Engineered with a focus on speed, scalability, and modern design tokens.**

* **Frontend**: React.js (Vite) for blazing-fast performance.
* **Styling**: **Tailwind CSS** + **Framer Motion** for a smooth, premium feel.
* **Backend**: Node.js & Express.js (RESTful API Architecture).
* **Database**: MongoDB Atlas with Mongoose ODM for flexible data modeling.
* **Security**: **JWT (JSON Web Tokens)** + **Bcrypt** for industry-standard encryption.
* **State Management**: Optimized with **React Context API** to prevent prop-drilling.

---

## 📂 Project Architecture

```text
EcoPulse/
 ├── client/          # Frontend (Vite + React)
 │    ├── src/        # Feature-driven components, Context & Hooks
 │    └── public/     # Static assets & Iconography
 ├── server/          # Backend (Node.js + Express)
 │    ├── models/     # MongoDB Schemas (User, Report, Badge, Notification)
 │    ├── routes/     # Protected & Public API Endpoints
 │    └── middleware/ # RBAC (Role-Based Access Control) & Auth logic
 └── package.json     # Orchestration & Dependency management
````

-----

## ⚙️ Installation & Setup

### 1\. Clone the Repository

```bash
git clone [https://github.com/gauravpatil-06/EcoPulse.git](https://github.com/gauravpatil-06/EcoPulse.git)
cd EcoPulse
```

### 2\. Dependency Management

```bash
# Setup Backend
cd server
npm install

# Setup Frontend
cd ../client
npm install
```

### 3\. Environment Configuration

Create a `.env` file in the **server** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_hyper_secure_secret
GOOGLE_CLIENT_ID=your_google_auth_id
```

### 4\. Launching the App

```bash
# Run both Client and Server (if using concurrently) or separately
npm run dev
```

-----

## 🛡️ Security & Reliability

  * **RBAC (Role-Based Access Control)**: Strict middleware ensures Swachhta Mitras and Citizens cannot access Admin-only analytics.
  * **Encrypted Communication**: All sensitive data is hashed; session integrity is maintained via stateless JWT.
  * **Performance Optimization**: Implemented **Lazy Loading** and **MongoDB Indexing** for near-instant dashboard updates.
  * **Responsive Integrity**: A "Mobile-First" approach ensuring Swachhta Mitras can use the app easily on-the-go.

-----

## 🚧 Challenges & Solutions

  * **Real-Time Sync**: Used a notification polling system to update the Citizen's UI as soon as a **Swachhta Mitra** completes a pickup.
  * **Complex Role Handling**: Built a custom `ModuleLayout` system that dynamically injects UI elements based on the user's role without code duplication.
  * **Data Visualization**: Converted raw NoSQL data into meaningful trends using **Recharts**, helping Admins identify high-waste zones.

-----

## 👥 The Team

  * **Gaurav Patil** — *Lead Developer*
  * **Abhishek Survase**
  * **Suraj Desale**
  * **Snehal Aakhud**
  * **Vaishnavi Badgujar**

-----

> "EcoPulse is more than just a project; it's a working solution designed to eliminate friction in municipal waste management. We didn't just build a UI; we built a system that works for the community."

-----

\<div align="center"\>

**🌐 [Live Web App](https://ecopulsex.vercel.app/)** | **📁 [Source Code](https://github.com/gauravpatil-06/EcoPulse/)**

✨ **Report. Resolve. Reward. Making our cities cleaner and smarter.**

\</div\>

```
```
