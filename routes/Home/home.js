"use strict";
const express = require('express');
const router = express.Router();
const mongo = require("mongodb");
const session = require("express-session");


// Home Route For The Users 
router.get('/', (req, res) => {
    let homepageData = {};
    req.session.user ? homepageData.logoutBtn = true : homepageData.loginBtn = true;
    if (req.query.videoUploaded) { homepageData.videoUploaded = true };
    let DB = req.app.locals.DB;
    let mysort = { date: -1 };

    // Getting All Latest Videos From The DataBase 
    DB.collection("videos").find({ isPublished: true }).limit(8).sort(mysort).toArray(function(error, latestvid) {

        error ? console.log(error) : homepageData.latest = latestvid;

        // Getting All Business Videos From The DataBase 

        DB.collection("videos").find({ category: "business", isPublished: true }).limit(8).sort(mysort).toArray(function(error, business) {

            error ? console.log(error) : homepageData.business = business

            // Getting All Political Videos From The DataBase 

            DB.collection("videos").find({ category: "politics", isPublished: true }).limit(8).sort(mysort).toArray(function(error, politics) {

                error ? console.log(error) : homepageData.politics = politics;

                // Getting All Sports Videos From The DataBase 

                DB.collection("videos").find({ category: "sports", isPublished: true }).limit(8).sort(mysort).toArray(function(error, sports) {

                    error ? console.log(error) : homepageData.sports = sports;

                    res.render("index.hbs", homepageData);

                });

            });

        });

    });

});

// Single Video Page Route For Users
router.get('/video/:id', (req, res) => {
    let DB = req.app.locals.DB;
    let singleVideo = {};
    let findThis = { _id: mongo.ObjectId(req.params.id) };
    let mysort = { date: -1 };
    req.session.user ? singleVideo.logoutBtn = true : singleVideo.loginBtn = true;

    DB.collection("videos").findOne(findThis, function(error, reqVideo) {
        error ? console.log(error) : singleVideo.reqVideo = reqVideo;

        DB.collection("videos").find({ category: reqVideo.category, isPublished: true }).limit(3).sort(mysort).toArray(function(error, relatedVid) {

            error ? console.log(error) : singleVideo.related = relatedVid;
            res.render("videoPlayer.hbs", singleVideo);

        });
    });
});

// Upload Route For Users To Sumbit Their Videos
router.get('/upload', (req, res) => {
    let data = {};
    req.session.user ? data.logoutBtn = true : data.loginBtn = true;

    res.render("uploadVideo.hbs", data);
});

//Getting The Data From The Frontend 
router.post('/upload', (req, res) => {
    let DB = req.app.locals.DB;

    let incomingData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        date: Date(),
        isPublished: false
    };

    DB.collection("videos").insertOne(incomingData, function(error, result) {
        error ? console.log(error) : res.redirect("/?videoUploaded=true");
    });
});



module.exports = router;