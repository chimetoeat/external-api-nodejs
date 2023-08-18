const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.use(express.static("public"))
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended : true}))


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});


app.post("/login", function (req, res) {
    res.send("POST TEST")
})

app.listen("3000", function () {
    console.log("Server started at port 3000.");
  });