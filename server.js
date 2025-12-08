const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('<h1>Online Voting System - Login Page</h1><p>System is running...</p>');
});

app.get('/vote', (req, res) => {
    res.send('<h1>Voting Page</h1>');
});

app.get('/admin', (req, res) => {
    res.send('<h1>Admin Dashboard</h1>');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});