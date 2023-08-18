const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios = require('axios');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static("public"))
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended : true}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'a-very-secure-secret-key',
    resave: false,
    saveUninitialized: false
  }));

  
const errorMessage = ""


// Home route GET
app.get("/home/index", function (req, res) {
    if (req.session.user) {
        res.render("home", { user: req.session.user });
    } else {
        res.redirect("/account/login")
    }
    
});

// Login Route GET, if already logged in, it will redirect to Home.
app.get("/account/login", function (req, res) {
    if (req.session.user) {
        res.redirect("/home/index");
    } else {
        res.render("login", {errorMessage})
    }
});

// Login Route POST, check Username & Password via Post Request to given JSON External API
app.post('/account/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // POST REQUEST to external JSON API for authentication
        const apiResponse = await axios.post('https://netzwelt-devtest.azurewebsites.net/Account/SignIn', {
        username,
        password,
        });

        // Authorized users will be redirected to Home Page
        const loggedInUser = apiResponse.data.displayName
        req.session.user = loggedInUser;
        res.redirect("/home/index");
        
    } catch (error) {
        
        // Unauthorized users cannot access Home Page
        const errorMessage = "Invalid username or password"
        res.render("login", { errorMessage });
    }
  });

// Logout Route
app.post('/account/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/account/login');
});

// Server Port Setup
app.listen("3000", function () {
    console.log("Server started at port 3000.");
  });