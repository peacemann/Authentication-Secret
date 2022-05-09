//jshint esversion:6
require('dotenv').config();
console.log(process.env);
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

const user = new User({
  email: "test@test.com",
  password: "iloveplaintext"
})

// user.save();

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {

  const username = req.body.username;
  const password = req.body.password;

  newUser = new User({
    email: username,
    password: password
  });

  newUser.save(function (err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});


app.post("/login", function (req, res) {

  const username = req.body.username;
  const password = req.body.password;

console.log(req.body);

  User.findOne({email: username}, function (err, foundUser) {
    if (!err) {
      console.log(foundUser)
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          res.send("Wrong username/password.");
        }
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on 3000");
});
