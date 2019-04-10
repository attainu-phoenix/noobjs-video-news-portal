"use strict";

const express = require("express");

const router = express.Router();


router.get('/login', (req, res) => {
    res.render("login.hbs");
});

router.get('/signup', (req, res) => {
    res.render("signup.hbs");
});

router.post('/login', (req, res) => {
    res.redirect("/");
});

router.post('/signup', (req, res) => {
    res.redirect("/user/login");
});

module.exports = router;
