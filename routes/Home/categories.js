"use strict";
const express = require('express');
const router = express.Router();


router.get('/sports', (req, res) => {
    let DB = req.app.locals.DB;
    DB.collection("videos").find({category:"sports"}).toArray(function(error, videos) {
    
        if (error) {
            console.log(error);
        } else {
            let sports  = {
                sports: videos
            };
            res.render("sports.hbs",sports);
        }
    
    });
});

router.get('/business', (req, res) => {
    let DB = req.app.locals.DB;
    DB.collection("videos").find({category:"business"}).toArray(function(error, videos) {
    
        if (error) {
            console.log(error);
        } else {
            let business  = {
                business: videos
            };
            res.render("business.hbs",business);
        }
    
    });
});

router.get('/politics', (req, res) => {
    let DB = req.app.locals.DB;
    DB.collection("videos").find({category:"politics"}).toArray(function(error, videos) {
    
        if (error) {
            console.log(error);
        } else {
            let politics  = {
            politics: videos
            };
            res.render("politics.hbs",politics);
        }
    
    });
    
});




module.exports = router;