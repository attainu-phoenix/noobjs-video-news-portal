"use strict";

// All external libraries
const express = require("express");
const session = require("express-session");
const bcrypt = require('bcrypt');
const Joi = require("joi");
const saltRounds = 10;
const mongo = require("mongodb");
const router = express.Router();



router.get('/login', (req, res) => {
    if (req.session.user) {return res.redirect("/");}
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
    if (req.session.user) {return res.redirect("/");}
    let data = {};
    if(req.query.email) {data.email = true}
    res.render("signup.hbs",data);
});

router.post('/signup', (req, res) => {
    let DB = req.app.locals.DB;

    const schema = {
        name: Joi.string().min(3).required(),
        email:Joi.string().email({ minDomainAtoms: 2 }).required(),
        password:Joi.string().min(3).required()
    };

   const result = Joi.validate(req.body,schema);

   if(result.error) {return res.send(result.error.details[0].message);}

    var user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    var hash = bcrypt.hashSync(user.password, saltRounds);
    let dupilicateUser = { email: req.body.email};
    DB.collection("users").findOne(dupilicateUser, function(error,result) {
        if (error) {
          return console.log(error);
        }
    
       if(result) {
          return res.redirect("/user/signup?email=true");
       }
    });
    DB.collection("users").insertOne(user, function (error) {
        if (error) {
            res.send("Error occured while SignUp.");
        } else {
            res.redirect("/user/login");
        }

    });
});

router.get('/logout', (req, res) => {
    req.session.user = null;
    res.redirect("/");
});

module.exports = router;
