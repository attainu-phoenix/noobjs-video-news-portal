"use strict";
const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('adminLogin.hbs');
});

router.post('/login', (req, res) => {
    res.redirect('/admin/home');
});


router.get('/home', (req, res) => {
    res.render("adminPanel.hbs");
});


router.get('/home/video', (req, res) => {
    res.render("adminApp.hbs");
});


module.exports = router;