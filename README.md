# Online Voting System (Group 41)

## Project Description
An online voting system developed for COMP 35000SEF, featuring user authentication, role-based access (Admin/Voter), and real-time voting analytics.

## Prerequisites
* Node.js (v14 or higher)
* MongoDB Account (or local instance)

## Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/您的帳號/COMP3500_Group41_VotingSystem.git](https://github.com/您的帳號/COMP3500_Group41_VotingSystem.git)

2. Install dependencies:
   ```
   npm install

3. Create a `.env` file in the root directory and add your credentials:
   ```
   PORT=3000
   DB_NAME=voting_system
   MONGODB_URL=your_mongodb_connection_string_here
   SESSION_SECRET=your_secret_key

## Usage
1. Start the server:
   ```
   npm start

2. Visit `http://localhost:3000` in your browser.

3. Initialize Admin account: Visit `http://localhost:3000/seed` once to create the default admin.

4. Login with:
* Admin User `admin`/Password `password123`
