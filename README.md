# Student-TPO Mentoring System 🎓

A full-stack MERN mobile/web application to facilitate mentorship between students and the Training & Placement Officer (TPO).

## 🔧 Project Structure


## 🚀 Features

- Student profile management
- TPO dashboard with approval/rejection system
- JWT-based Authentication
- Mentoring feedback system
- (Optional) AI-based suggestions

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/Aftab2110/Student_TPO_Mentoring.git
cd Student_TPO_Mentoring

cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT_SECRET, etc.
npm run dev

cd ../client
npm install
npm run dev
