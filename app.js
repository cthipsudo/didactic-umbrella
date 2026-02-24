const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const session = require('express-session')

mongoose.connect("mongodb://127.0.0.1:27017/authDemo");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!");
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'notagoodsecret', resave: false, saveUninitialized: true }));

const userLoggedIn = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
};

app.get('/', (req, res) => {
    res.send('Welcome to the churn');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { password, username } = req.body.user;
    const newUser = await new User({username, password});
    await newUser.save();
    req.session.user_id = newUser._id;
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body.user;

    const foundUser = await User.findAndValidate(username, password);

    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }

});

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    req.session.destroy();
    res.redirect('/login');
});

app.get('/secret', userLoggedIn, (req, res) => {
    res.render('secret.ejs');
});
app.get('/topsecret', userLoggedIn, (req, res) => {
    res.send('Top Secret');
});

app.listen(3000, () => {
    console.log('I live to serve...');
})