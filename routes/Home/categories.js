"use strict";
const express = require('express');
const router = express.Router();

router.get('/categories', (req, res) => {
    res.render('index.hbs');
});


router.get('/categories/sports', (req, res) => {
    res.render('sports.hbs');
});

router.get('/categories/business', (req, res) => {
    res.render('business.hbs');
});

router.get('/categories/politics', (req, res) => {
    res.render("politics.hbs");
});






module.exports = router;