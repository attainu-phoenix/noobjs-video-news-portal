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
    let findThis = { _id: mongo.ObjectID(req.params.id)};
    let mysort = { date: -1 };
    req.session.user ? singleVideo.logoutBtn = true : singleVideo.loginBtn = true;
    if (req.session.user) { singleVideo.user = req.session.user };

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

    let form = new multiparty.Form();

    let incomingData = {
        date: Date(),
        isPublished: false
    };


    // Parse the form to get uploaded data
    form.parse(req, function(error, fields, files) {

        // // Get the file name for the fist file.
        let file1Path = files.thumbnail[0].path;
        let file1Name = path.basename(file1Path);
        
		let file2Path = files.video[0].path;
        let file2Name = path.basename(file2Path);
        
		
		incomingData.thumbnail = file1Name;
        incomingData.video = file2Name;
        incomingData.title = fields.title[0];
        incomingData.description = fields.description[0];
        incomingData.category = fields.category[0];

        // // Move the first file from tmp folder to uploads/first
        fs.rename(file1Path, "uploads/images/" + file1Name, function(error) {
            if(error) { console.log(error);return res.send("error uploading file");}

        //     // Move the second file from tmp folder to uploads/second
            fs.rename(file2Path, "uploads/videos/" + file2Name, function(error) {
                if(error) { console.log(error);return res.send("error uploading file");}

                // Finally redirect back to index page.
                // This is where you need to put all your MongoDB insert calls if you have any.

                DB.collection("videos").insertOne(incomingData, function(error, result) {
                        error ? console.log(error) : res.redirect("/?videoUploaded=true");
                });
            });
        });

    });

});


router.get('/comments/:id', (req, res) => {
    let DB = req.app.locals.DB;
    DB.collection("comments").find({videoId:req.params.id}).toArray(function(error, comments) {
       
        error ? console.log(error) : res.json(comments);

       
    
    });
});

router.post('/comments/:id', (req, res) => {
    if (!req.session.user) { return res.redirect("/user/login")};
    let DB = req.app.locals.DB;
    let newComment = {
        name: req.body.name,
        commentContent: req.body.commentContent,
        userId:req.body.userId,
        videoId:req.params.id
    }
    
    DB.collection("comments").insertOne(newComment, function(error, result) {
      error ? console.log(error) : res.send("ok");
     
    });
});



module.exports = router;
