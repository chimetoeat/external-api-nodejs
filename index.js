const express = require("express");
const ejs = require("ejs");
const axios = require('axios');
const session = require('express-session');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.static(__dirname + '/public'))
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended : true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'a-very-secure-secret-key',
    resave: false,
    saveUninitialized: false
}));


const errorMessage = ""


// Home route GET
app.get("/home/index", async (req, res) => {
    try {
        // Check if user is logged in
        if (req.session.user) {
            // GET Request to External API to pass to View
            const apiData = await axios.get('https://netzwelt-devtest.azurewebsites.net/Territories/All');
            const territories = apiData.data.data;
            res.render("home", { user: req.session.user, territories});
        } else {
            res.redirect("/account/login")
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data from the API.' });
    }

    
});
app.get("/", function (req, res) {
    res.redirect("/home/index");
})

// Login Route GET
app.get("/account/login", function (req, res) {
    // If user is already logged in, it will redirect to Home.
    if (req.session.user) {
        res.redirect("/home/index");
    } else {
        res.render("login", {errorMessage})
    }
});

// Login Route POST
app.post('/account/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // POST REQUEST to external JSON API for Authentication
        const apiResponse = await axios.post('https://netzwelt-devtest.azurewebsites.net/Account/SignIn', {
        username,
        password,
        });

        // Authorized users will be redirected to Home Page
        const loggedInUser = apiResponse.data.displayName
        req.session.user = loggedInUser;
        res.redirect("/home/index");
        
    } catch (error) {       
        // Show error to Unauthorized Users
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