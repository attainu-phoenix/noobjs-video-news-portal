"use strict";
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.hbs');
});

router.get('/videoStreaming', (req, res) => {
    res.render('videoPlayer.hbs');
});



module.exports = router;