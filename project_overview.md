# PROJECT: CampusWallet - Sri Lankan Student Expense Tracker

# 1. Overview
This is a web application designed to help Sri Lankan university students manage their monthly expenses, track Mahapola/Bursary income, and monitor lending/borrowing among friends.

# 2. Tech Stack
- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Email Service:** Resend

# 3. Key Features
- **Budget Tracking:** Visual breakdown of expenses vs. Income.
- **Lankan Context:** Specific categories for "Canteen", "Bus", "Reloads".
- **Debt Manager:** Tracks "Who owes me" and "Who I owe".
- **Budget Alerts:** Email warnings when spending exceeds 80% of the limit.

# 4. Setup Instructions for Developers
1. Clone the repo.
2. Navigate to `/server` -> Run `npm install` -> Create `.env` file with Supabase keys -> Run `npm run dev`.
3. Navigate to `/client` -> Run `npm install` -> Run `npm run dev`.