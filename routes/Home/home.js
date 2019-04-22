"use strict";
const express = require('express');
const router = express.Router();
const mongo = require("mongodb");
const session = require("express-session");
const multiparty = require("multiparty");
const fs = require("fs");
const path = require("path");



// Home Route For The Users 
router.get('/', (req, res) => {
    // The Data Object We Are Going To Send To The Frontend.
    let homepageData = {};

    // Checking If The User Is Logged In Or Not And Displaying Respective Buttons.
    req.session.user ? homepageData.logoutBtn = true : homepageData.loginBtn = true;

    // Checking If The User Is Redirected To The Homepage By Upload Route Showing His Video Upload Status.
    if (req.query.videoUploaded) { homepageData.videoUploaded = true };

    // Global Database Variable.
    let DB = req.app.locals.DB;

    // Sorting The Data With Descending Date Order.
    let mysort = { date: -1 };

    // Getting 8 Latest Videos Sorted By Date From The Videos DB Collection.
    DB.collection("videos").find({ isPublished: true }).limit(8).sort(mysort).toArray(function(error, latestvid) {

        error ? console.log(error) : homepageData.latest = latestvid;

        // Getting 8 Business Category Videos Sorted By Date From The Videos DB Collection.. 

        DB.collection("videos").find({ category: "business", isPublished: true }).limit(8).sort(mysort).toArray(function(error, business) {

            error ? console.log(error) : homepageData.business = business

            // Getting 8 Politics Category Videos Sorted By Date From The Videos DB Collection.. 

            DB.collection("videos").find({ category: "politics", isPublished: true }).limit(8).sort(mysort).toArray(function(error, politics) {

                error ? console.log(error) : homepageData.politics = politics;

                // Getting 8 Sports Category Videos Sorted By Date From The Videos DB Collection.  

                DB.collection("videos").find({ category: "sports", isPublished: true }).limit(8).sort(mysort).toArray(function(error, sports) {

                    error ? console.log(error) : homepageData.sports = sports;


                    //Rendering The Homepage With Retrieved Data From The Database.
                    res.render("index.hbs", homepageData);

                });

            });

        });

    });

});

// Single Video Page Route For Users To View A Single Specific Video.
router.get('/video/:id', (req, res) => {

    // Global Database Variable.
    let DB = req.app.locals.DB;

    // The Data Object We Are Going To Send To The Frontend.
    let singleVideo = {};

    //Finding The Requested Video Data From The Database.
    let findThis = { _id: mongo.ObjectID(req.params.id) };

    // Sorting The Data With Descending Date Order.
    let mysort = { date: -1 };

    // Checking If The User Is Logged In Or Not And Displaying Respective Buttons.
    req.session.user ? singleVideo.logoutBtn = true : singleVideo.loginBtn = true;
    if (req.session.user) { singleVideo.user = req.session.user };

    //Finding The Requested Video Data From The Database.
    DB.collection("videos").findOne(findThis, function(error, reqVideo) {
        error ? console.log(error) : singleVideo.reqVideo = reqVideo;
        //Finding Related Videos From Same Category As The Requested Video From The Videos DB Collection.
        DB.collection("videos").find({ category: reqVideo.category, isPublished: true }).limit(3).sort(mysort).toArray(function(error, relatedVid) {

            error ? console.log(error) : singleVideo.related = relatedVid;

            // Rendering The Single Videopage With The Data.
            res.render("videoPlayer.hbs", singleVideo);

        });
    });
});

// Upload Route For Users To Sumbit Their Videos
router.get('/upload', (req, res) => {
    // The Data Object We Are Going To Send To The Frontend.
    let data = {};

    // Checking If The User Is Logged In Or Not And Displaying Respective Buttons.
    req.session.user ? data.logoutBtn = true : data.loginBtn = true;

    //Rendering The Upload Page For User To Upload Videos.
    res.render("uploadVideo.hbs", data);
});

//Getting The Data From The Frontend 
router.post('/upload', (req, res) => {

    // Global Database Variable.
    let DB = req.app.locals.DB;

    // Using Multiparty Module To Get Files And Form Data From The Frontend.
    let form = new multiparty.Form();

    //Data Object That We Are Going To Store In The Database.
    let incomingData = {
        date: Date(),
        isPublished: false
    };


    // Parse the form to get uploaded data
    form.parse(req, function(error, fields, files) {

        // Getting the file name for the thumbnail file.
        let file1Path = files.thumbnail[0].path;
        let file1Name = path.basename(file1Path);

        // Getting the file name for the video file.
        let file2Path = files.video[0].path;
        let file2Name = path.basename(file2Path);

        //Extracting The Form Text Data From The Fields
        incomingData.thumbnail = file1Name;
        incomingData.video = file2Name;
        incomingData.title = fields.title[0];
        incomingData.description = fields.description[0];
        incomingData.category = fields.category[0];

        // Move the thumbnail from tmp folder to uploads/images
        fs.rename(file1Path, "uploads/images/" + file1Name, function(error) {
            if (error) { console.log(error); return res.send("error uploading file"); }

            // Move the video from tmp folder to uploads/videos
            fs.rename(file2Path, "uploads/videos/" + file2Name, function(error) {
                if (error) { console.log(error); return res.send("error uploading file"); }


                // Adding The All Data To The MongoDB Videos Collection And Redirecting User To The HomePage With The Relevent Message.
                DB.collection("videos").insertOne(incomingData, function(error, result) {
                    error ? console.log(error) : res.redirect("/?videoUploaded=true");
                });
            });
        });
    });
});


// Route For Getting All The Comments For The Specific Video In The JSON Format
router.get('/comments/:id', (req, res) => {
    // Global Database Variable.
    let DB = req.app.locals.DB;

    // Sorting The Data With Descending Date Order
    let mysort = { date: -1 };

    // Getting All The Comments For The Specific Video From Comments DB Collection.
    DB.collection("comments").find({ videoId: req.params.id }).sort(mysort).toArray(function(error, comments) {

        // Sending The JSON Data Object To Frontend.
        error ? console.log(error) : res.json(comments);



    });
});


// Route For Posting Comments On Specific Video.
router.post('/comments/:id', (req, res) => {
    // Checking If The User Is Logged In Or Not And Redirecting Him To Login Page If User Is Not Logged In.
    if (!req.session.user) { return res.redirect("/user/login") };

    // Global Database Variable.
    let DB = req.app.locals.DB;

    // Comment Data Object That We Are Going To Store In Our Comments DB Collection.
    let newComment = {
        name: req.body.name,
        commentContent: req.body.commentContent,
        userId: req.body.userId,
        videoId: req.params.id,
        date: Date()
    }

    // Storing The Comment Object
    DB.collection("comments").insertOne(newComment, function(error, result) {
        error ? console.log(error) : res.send("ok");

    });
});



module.exports = router;