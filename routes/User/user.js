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
    res.render("index.hbs");
});

router.post('/signup', (req, res) => {
    res.render("index.hbs");
});

module.exports = router;
