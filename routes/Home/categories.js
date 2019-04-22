"use strict";
const express = require('express');
const router = express.Router();

//Route For Sports Category Page
router.get('/sports', (req, res) => {

    // Global Database Variable.
    let DB = req.app.locals.DB;

    // The Data Object We Are Going To Send To The Frontend.
    let sportsData = {};

    // Checking If The User Is Logged In Or Not And Displaying Respective Buttons.
    req.session.user ? sportsData.logoutBtn = true : sportsData.loginBtn = true;

    // Getting All Sports Category Videos Sorted By Date From The Videos DB Collection.  
    DB.collection("videos").find({ category: "sports", isPublished: true }).toArray(function(error, videos) {

        error ? console.log(error) : sportsData.sports = videos;

        // Rendering Sports Category Page With Data
        res.render("sports.hbs", sportsData);

    });
});

//Route For Business Category Page
router.get('/business', (req, res) => {
    // Global Database Variable.
    let DB = req.app.locals.DB;

    // The Data Object We Are Going To Send To The Frontend.
    let businessData = {};

    // Checking If The User Is Logged In Or Not And Displaying Respective Buttons.
    req.session.user ? businessData.logoutBtn = true : businessData.loginBtn = true;

    // Getting All Business Category Videos Sorted By Date From The Videos DB Collection.  
    DB.collection("videos").find({ category: "business", isPublished: true }).toArray(function(error, videos) {

        error ? console.log(error) : businessData.business = videos;

        // Rendering Business Category Page With Data
        res.render("business.hbs", businessData);

    });
});

//Route For Political Category Page
router.get('/politics', (req, res) => {
    // Global Database Variable.
    let DB = req.app.locals.DB;

    // The Data Object We Are Going To Send To The Frontend.
    let politicsData = {};

    // Checking If The User Is Logged In Or Not And Displaying Respective Buttons.
    req.session.user ? politicsData.logoutBtn = true : politicsData.loginBtn = true;

    // Getting All Politics Category Videos Sorted By Date From The Videos DB Collection.  
    DB.collection("videos").find({ category: "politics", isPublished: true }).toArray(function(error, videos) {

        error ? console.log(error) : politicsData.politics = videos;

        // Rendering Politics Category Page With Data
        res.render("politics.hbs", politicsData);

    });
});

module.exports = router;