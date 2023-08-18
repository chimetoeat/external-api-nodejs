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


// Home route GET
app.get("/", function (req, res) {
    if (req.session.user) {
        res.render("home", { user: req.session.user });
    } else {
        res.redirect("/login")
    }
    
});

// Login Route GET, if already logged in, it will redirect to Home.
app.get("/login", function (req, res) {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("login")
    }
});

// Login Route POST, check Username & Password via Post Request to given JSON External API
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // POST REQUEST to external JSON API for authentication
        const apiResponse = await axios.post('http://localhost:3000/authenticate', {
        username,
        password,
        });

        // Authorized users will be redirected to Home Page
        const loggedInUser = apiResponse.data.displayName
        req.session.user = loggedInUser;
        res.redirect("/");
        
    } catch (error) {

        // Unauthorized users cannot access Home Page
        console.error(error);
        res.render("login");
    }
  });


// Logout Route
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});



  // CODES HERE ARE FOR TESTING PURPOSES
  const SignInRequest = [{
    username: 'user1',
    password: 'pass1'
}];

  const UserData = {
    username: 'user1',
    displayName: 'User 1',
    roles: ["Developer", "Designer", "Lead"]
  };
  
  app.post('/authenticate', (req, res) => {
    const { username, password } = req.body;
  
    const user = SignInRequest.find(u => u.username === username && u.password === password);
  
    if (user) {
      res.status(200).json(UserData);
    }
  });

  // CODES HERE ARE FOR TESTING PURPOSES

app.listen("3000", function () {
    console.log("Server started at port 3000.");
  });