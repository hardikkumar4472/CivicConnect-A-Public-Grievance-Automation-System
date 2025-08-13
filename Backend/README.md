
# 🏙️ CivicConnect - Smart Sector-Based Issue Reporting System

## 📌 Project Description

**CivicConnect** is a sector-based municipal issue reporting system built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It allows citizens to report local civic issues—such as water supply, road damage, or electricity problems—within their specific sector or ward. Sector heads manage families using house-number-based Family IDs, add citizens, and track issue status through a secure, role-based dashboard.

## ❓ Problem It Solves

In urban environments, citizens face problems like:
- Broken infrastructure (roads, lights, water lines)
- No clear way to report or track issues
- Poor accountability from local authorities
- Cross-area confusion or unauthorized access

**CivicConnect** solves this by:
- Assigning issues and citizens to specific sectors
- Giving exclusive control to area heads
- Tracking resolution and citizen satisfaction

## 💡 Novelty & Unique Features

1. **Family ID Based on House Number**  
   - Automatically generated Family ID using the format: `FAM-SEC5-H112`  
   - Ties each citizen directly to their house and sector.

2. **Sector-Locked Access Control**  
   - Citizens and sector heads are restricted to their own sectors.  
   - No cross-sector visibility or interference.

3. **Controlled Onboarding by Sector Heads**  
   - Only heads can create citizens in their area.  
   - No self-registration or cross-sector joining.

4. **Google Maps Location Pinning**  
   - Citizens use a map to select the exact location of the issue.

5. **Citizen Feedback System**  
   - After the issue is marked "Resolved", the citizen can give a ⭐ 1–5 rating and a comment.

6. **Email-Based Temporary Login**  
   - Heads send login credentials via Gmail to citizens upon account creation.

## 🛠️ Tech Stack Used

| Layer       | Technology                         |
|-------------|------------------------------------|
| Frontend    | React.js, TailwindCSS, Axios       |
| Backend     | Node.js, Express.js                |
| Database    | MongoDB, Mongoose                  |
| Auth        | JWT (JSON Web Tokens) + bcrypt     |
| Email       | NodeMailer                         |
| Map         | Google Maps JavaScript API         |
| Image Upload| Multer / Cloudinary (optional)     |

## 👥 User Roles & Access

### 🧑‍💼 Sector Head
- Can register/login and create their **own sector**
- Adds families using **house number**, auto-generating Family ID
- Creates citizen accounts under each family
- Sends temporary password to citizen’s Gmail
- Views and manages issues **only in their sector**
- Can update status and comment on issues
- Dashboard: Total, pending, in-progress, resolved issues + feedback

### 🧍 Citizen
- Can login using **Family ID + password**
- Can report issues with:
  - Title, description, image, location, category
- Can only view and report in their **assigned sector**
- Can see issue status and comments
- Can give feedback (1–5 stars + optional comment) **after issue is resolved**

## 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (citizen vs. head)
- Unique login via **Family ID** (no email-based login for citizens)
- Citizens tied to sector; no cross-sector data access


## 🚀 How It Works

1. Head registers and creates a new **sector**
2. Head assigns families using **house number → Family ID**
3. Head creates citizen accounts with Gmail & sends temporary password
4. Citizens log in with **Family ID + password**
5. Citizens report civic issues in their area
6. Head updates status/comments
7. Citizens provide feedback after issue resolution

## 📁 Folder Structure Overview
```
CivicConnect/
├── client/ (React frontend)
│   ├── pages/
│   ├── components/
│   ├── context/
│   └── App.jsx
├── server/ (Node.js backend)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── app.js
```

## ⚙️ Future Improvements
- OTP login via mobile/email
- Real-time chat with sector head
- Admin portal to monitor multiple sectors (if added later)
- CSV export of issue reports

## 📜 License
This project is developed for educational and civic-tech startup purposes. Please ensure ethical use if deploying publicly.

## 🙌 Author
Developed by HARDIK KUMAR for college submission and potential real-world deployment.

## 📬 Contact
For contributions or collaborations, reach out at: `hardikv715@gmail.com`
