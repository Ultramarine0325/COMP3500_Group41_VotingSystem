const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

const User = require('./models/User');
const Election = require('./models/Election');
const Vote = require('./models/Vote');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'secret_key_comp3500_group41',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: process.env.DB_NAME
        });
        console.log("MongoDB Connected Successfully!");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err);
        process.exit(1); 
    }
}

app.get('/', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.render('login', { error: "Account or Password Invaild" });
        }

        req.session.user = user;

        res.redirect('/dashboard'); 
    } catch (error) {
        console.error(error);
        res.render('login', { error: "System Error" });
    }
});

app.get('/dashboard', async (req, res) => {
    if (!req.session.user) return res.redirect('/');

    const user = req.session.user;
    
    if (user.role === 'admin') {
        const elections = await Election.find({});
        res.render('admin_dashboard', { user, elections });
    } else {
        const elections = await Election.find({
            status: 'active',
            allowedGroups: user.eligibleGroup,
            _id: { $nin: user.votedElections }
        });
        res.render('voter_dashboard', { user, elections });
    }
});

app.get('/create-election', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/');
    res.render('create_election');
});

app.post('/create-election', async (req, res) => {
    try {
        const { title, description, startDate, endDate, allowedGroups, candidatesStr } = req.body;

        const candidatesArray = candidatesStr.split(/\r?\n/)
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .map(name => ({ name: name, voteCount: 0 }));

        const newElection = new Election({
            title,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'active',
            allowedGroups: Array.isArray(allowedGroups) ? allowedGroups : [allowedGroups],
            candidates: candidatesArray
        });

        await newElection.save();
        console.log("New Election Created:", title);

        res.send(`
            <h1>Create Successfully！</h1>
            <p>Election「${title}」Released。</p>
            <a href="/">Return to the homepage and login again to review</a>
        `);

    } catch (err) {
        console.error(err);
        res.send("Create Fail: " + err.message);
    }
});

app.post('/delete-election/:id', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.send("Access Denied");
    }

    const electionId = req.params.id;

    try {
        await Vote.deleteMany({ electionId: electionId });

        await Election.findByIdAndDelete(electionId);

        console.log(`Election [${electionId}] deleted by admin.`);
        
        res.redirect('/dashboard');

    } catch (err) {
        console.error(err);
        res.send("Delete Fail: " + err.message);
    }
});

app.get('/results/:id', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.send("Access Denied");
    }

    try {
        const electionId = req.params.id;
        const election = await Election.findById(electionId);
        
        if (!election) return res.send("Election Not Found");

        res.render('results_page', { election });
    } catch (err) {
        console.error(err);
        res.send("Data Retrieval Failure");
    }
});

app.get('/vote/:id', async (req, res) => {
    if (!req.session.user) return res.redirect('/');

    try {
        const election = await Election.findById(req.params.id);
        const user = await User.findById(req.session.user._id);

        if (user.votedElections.includes(election._id)) {
            return res.send("<h1>Error: Voted already</h1><a href='/dashboard'>Back</a>");
        }

        res.render('voting_page', { election });
    } catch (err) {
        res.send("Election Not Found");
    }
});

app.post('/vote/:id', async (req, res) => {
    if (!req.session.user) return res.redirect('/');
    
    const electionId = req.params.id;
    const { selectedCandidate } = req.body;
    const userId = req.session.user._id;

    try {
        const user = await User.findById(userId);
        if (user.votedElections.includes(electionId)) {
            return res.send("No Duplicate Votes");
        }

        const newVote = new Vote({
            electionId: electionId,
            selectedCandidate: selectedCandidate
        });
        await newVote.save();

        user.votedElections.push(electionId);
        await user.save();

        req.session.user = user; 

        await Election.updateOne(
            { _id: electionId, "candidates.name": selectedCandidate },
            { $inc: { "candidates.$.voteCount": 1 } }
        );

        res.send(`
            <h1>Vote Successfully！ (Vote Cast Successfully)</h1>
            <p>You vote to：${selectedCandidate}</p>
            <p>Your voting has been encrypted and stored anonymously</p>
            <a href="/dashboard">Back to dashboard</a>
        `);

    } catch (err) {
        console.error(err);
        res.send("Vote Fail, Please try again");
    }
});

app.get('/seed-voter', async (req, res) => {
    try {
        const exist = await User.findOne({ username: 'student1' });
        if(exist) return res.send("Student1 already exists!");

        await new User({
            username: 'student1',
            password: 'password123',
            fullName: 'David Chan',
            hkid: 'S123456(8)',
            phoneNumber: '98765432',
            role: 'voter',
            eligibleGroup: 'student'
        }).save();
        res.send("Student Account Created! <br>User: student1 <br>Pass: password123 <br><a href='/'>Go to Login</a>");
    } catch (err) { res.send(err.message); }
});

app.get('/seed', async (req, res) => {
    try {
        const exist = await User.findOne({ username: 'admin' });
        if(exist) return res.send("Admin already exists!");

        const testAdmin = new User({
            username: 'admin',
            password: 'password123', 
            fullName: 'Test Administrator',
            hkid: 'A123456(7)',
            phoneNumber: '91234567',
            role: 'admin',
            eligibleGroup: 'staff'
        });
        await testAdmin.save();
        res.send("Admin Account Created! <br>User: admin <br>Pass: password123 <br><a href='/'>Go to Login</a>");
    } catch (err) {
        res.send("Error: " + err.message);
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});
