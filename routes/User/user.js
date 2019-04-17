"use strict";

// All external libraries
const express = require("express");
const session = require("express-session");
const mongo = require("mongodb");
const router = express.Router();



router.get('/login', (req, res) => {
    res.render("login.hbs");
});

router.post('/login', (req, res) => {
    let DB = req.app.locals.DB;
    var userDetails = {
        email: req.body.email,
        password: req.body.password
    };

    DB.collection("users").findOne(userDetails, function(error, user) {
        if (error) {
            console.log("Error occured while connecting DB");
            return;
        } if(!user) {
            res.send("Invalid username or password.");
            return;
        }
        req.session.user = user;
        res.redirect("/");
    });
});

router.get('/signup', (req, res) => {
    res.render("signup.hbs");
});

router.post('/signup', (req, res) => {
    let DB = req.app.locals.DB;
    var user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    DB.collection("users").insertOne(user, function (error) {
        if (error) {
            res.send("Error occured while SignUp.");
        } else {
            res.send("Successfully signed up !!!");
        }

    });

});

module.exports = router;
