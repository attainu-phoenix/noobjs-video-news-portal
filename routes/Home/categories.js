"use strict";
const express = require('express');
const router = express.Router();


router.get('/sports', (req, res) => {
    res.render('sports.hbs');
});

router.get('/business', (req, res) => {
    res.render('business.hbs');
});

router.get('/politics', (req, res) => {
    res.render("politics.hbs");
});




module.exports = router;