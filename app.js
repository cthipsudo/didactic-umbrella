const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');

mongoose.connect("mongodb://127.0.0.1:27017/authDemo");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the churn');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const {password, username} = req.body.user;
    const hash = await bcrpyt.hash(password, 12);
    const newUser = await new User({
        username, password: hash
    });
    await newUser.save();
    res.redirect('/');
});

app.get('/secret', (req, res) => {
    res.send('This is a secret! Only shown if logged in...')
});

app.listen(3000, () => {
    console.log('I live to serve...');
})