# Online Voting System (Group 41)

## Project Description
An online voting system developed for COMP 35000SEF, featuring user authentication, role-based access (Admin/Voter), and real-time voting analytics.

## Live Demo
* **Server URL:** https://comp3500-group41-votingsystem.onrender.com

## Prerequisites
* Node.js 
* MongoDB Account

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ultramarine0325/COMP3500_Group41_VotingSystem.git

2. Install dependencies:
   ```
   npm install

3. Create a `.env` file in the root directory and add your credentials:
   ```
   PORT=3000
   DB_NAME=voting_system
   MONGODB_URL=mongodb+srv://db_user:14226245@cluster0.ewnikit.mongodb.net/?appName=Cluster0
   SESSION_SECRET=COMP3500

## Usage
1. Start the server:
   ```
   npm start

2. Visit `http://localhost:3000` in your browser.

3. Initialize Accounts (First Run Only):
* Visit http://localhost:3000/seed to create the default Admin account.
* Visit http://localhost:3000/seed-voter to create a default Student Voter account.

4. Login Credentials:

* Administrator:
`Username: admin`
`Password: password123`

* Voter (Student):
`Username: student1`
`Password: password123`
