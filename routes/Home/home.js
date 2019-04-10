"use strict";
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.hbs');
});

router.get('/videoStreaming', (req, res) => {
    res.render('videoPlayer.hbs');
});

router.get('/upload', (req, res) => {
    res.render("uploadVideo.hbs");
});



module.exports = router;