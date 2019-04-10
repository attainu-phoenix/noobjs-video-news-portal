"use strict";
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.hbs');
});

router.get('/videoStreaming', (req, res) => {
    res.render('videoPlayer.hbs');
});


router.get('/sports', (req, res) => {
    res.render('sports.hbs');
});

router.get('/business', (req, res) => {
    res.render('business.hbs');
});

router.get('/politics', (req, res) => {
    res.render("politics.hbs");
});

router.post('/videoStreaming', (req, res) => {
    res.redirect('home/videoStreaming');
});




module.exports = router;