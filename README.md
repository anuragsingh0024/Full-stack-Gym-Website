# 🏋️‍♂️ Full-Stack Gym Website

![GitHub Repo Stars](https://img.shields.io/github/stars/your-username/gym-website?style=social)
![GitHub Forks](https://img.shields.io/github/forks/your-username/gym-website?style=social)
![GitHub License](https://img.shields.io/github/license/your-username/gym-website)
![Deployment Status](https://img.shields.io/badge/deployed-success-green)

🚀 **Live Demo**: [Visit Website](https://full-stack-gym-website-rho.vercel.app)

## 📌 Project Overview
A fully functional **gym management website** built using the **MERN Stack**. This website allows users to:
✅ Register and login securely
✅ Purchase and manage memberships
✅ View gym supplements and make purchases
✅ Access a personalized dashboard
✅ Admin panel to manage users, trainers, and transactions

## 🎯 Features
- 🔐 **Authentication** (Login, Signup, OTP verification)
- 🏋️‍♂️ **Membership Plans** (Purchase & Track Status)
- 🛒 **Supplements Page** (E-commerce style product listing)
- 📊 **User Dashboard** (Membership & Purchase History)
- 👨‍💻 **Admin Panel** (Manage Users, Trainers, and Transactions)
- 🌎 **Deployed on Render (Backend) & Vercel (Frontend)**

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT, bcrypt.js, OTP Verification
- **Storage**: Cloudinary (For Image Uploads)
- **Deployment**: Render (Backend), Vercel (Frontend)

## 🚀 Installation & Setup
```bash
# Clone the repository
git clone https://github.com/your-username/gym-website.git
cd gym-website

# Install dependencies
npm install  # For frontend
cd backend && npm install  # For backend

# Set up environment variables (create .env file)
# For backend (inside /backend/.env)
MONGO_URI=your-mongo-uri
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

## 📸 Screenshots
### 🔹 Home Page
![Home Page](https://via.placeholder.com/800x400.png?text=Home+Page+Screenshot)
### 🔹 Dashboard
![Dashboard](https://via.placeholder.com/800x400.png?text=Dashboard+Screenshot)
### 🔹 Admin Panel
![Admin Panel](https://via.placeholder.com/800x400.png?text=Admin+Panel+Screenshot)

## 🛠️ API Endpoints
### 🔑 Authentication
```bash
POST /api/v1/auth/signup  # User Signup
POST /api/v1/auth/login   # User Login
```
### 🏋️‍♂️ Membership
```bash
GET /api/v1/membership/plans  # Get all membership plans
POST /api/v1/membership/purchase  # Purchase a membership
```
### 🛒 Supplements
```bash
GET /api/v1/supplements  # Get all supplements
```

## 🏗️ Future Enhancements
- 📩 **Email Notifications** for purchases & membership expiry
- 🏆 **Leaderboard & Challenges** for user engagement
- 📱 **Mobile-Friendly PWA**

## 💖 Support & Contributions
Feel free to **star 🌟 the repo** if you like it! Contributions are welcome via **Pull Requests (PRs)**.

📩 **Contact Me**: [your-email@example.com](mailto:your-email@example.com) | [LinkedIn](https://linkedin.com/in/yourprofile)

---
**© 2025 Gym Website | Built with ❤️ by Your Name**
