"use strict";
const express = require('express');
const router = express.Router();

//Route For Sports Category Page
router.get('/sports', (req, res) => {
    let DB = req.app.locals.DB;
    let sportsData = {};
    req.session.user ? sportsData.logoutBtn = true : sportsData.loginBtn = true;

    DB.collection("videos").find({ category: "sports", isPublished: true }).toArray(function(error, videos) {

        error ? console.log(error) : sportsData.sports = videos;
        res.render("sports.hbs", sportsData);

    });
});

//Route For Business Category Page
router.get('/business', (req, res) => {
    let DB = req.app.locals.DB;
    let businessData = {};
    req.session.user ? businessData.logoutBtn = true : businessData.loginBtn = true;
    DB.collection("videos").find({ category: "business", isPublished: true }).toArray(function(error, videos) {

        error ? console.log(error) : businessData.business = videos;
        res.render("business.hbs", businessData);

    });
});

//Route For Political Category Page
router.get('/politics', (req, res) => {
    let DB = req.app.locals.DB;
    let politicsData = {};
    req.session.user ? politicsData.logoutBtn = true : politicsData.loginBtn = true;

    DB.collection("videos").find({ category: "politics", isPublished: true }).toArray(function(error, videos) {

        error ? console.log(error) : politicsData.politics = videos;
        res.render("politics.hbs", politicsData);

    });
});

module.exports = router;