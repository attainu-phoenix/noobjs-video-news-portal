"use strict";
const express = require('express');
const router = express.Router();
const mongo = require("mongodb");



router.get('/', (req, res) => {

    let homepageData = {};

    if(req.query.videoUploaded) {
        homepageData.videoUploaded = true
    }

    let DB = req.app.locals.DB;


     // Getting All Latest Videos From The DataBase 
    DB.collection("videos").find({}).limit(8).toArray(function(error, latestvid) {
    
        if (error) {
            console.log(error);
        } else {
           homepageData.latest = latestvid;
        }  


        DB.collection("videos").find({category:"business"}).limit(8).toArray(function(error, business) {
    
            if (error) {
                console.log(error);
            } else {
                
               homepageData.business = business;  
            }
            
            DB.collection("videos").find({category:"politics"}).limit(8).toArray(function(error, politics) {
    
                if (error) {
                    console.log(error);
                } else {
                    
                   homepageData.politics = politics;
                }  

                DB.collection("videos").find({category:"sports"}).limit(8).toArray(function(error, sports) {
    
                    if (error) {
                        console.log(error);
                    } else {
                        
                       homepageData.sports = sports;
                        res.render("index.hbs",homepageData);
                    }  
            
                });
        
            });
    
        });

    });
 
});

router.get('/video/:id', (req, res) => {
    let DB = req.app.locals.DB;
    let singleVideo = {};
    let findThis = {_id:mongo.ObjectId(req.params.id)};
    
    DB.collection("videos").findOne(findThis, function(error,reqVideo) {
        if (error) {
          return console.log("error connecting to the collection ");
        } else {
            singleVideo.reqVideo = reqVideo;

           DB.collection("videos").find({category:reqVideo.category}).limit(3).toArray(function(error, relatedVid) {
           
               if (error) {
                   console.log(error);
               } else {
                    singleVideo.related = relatedVid;
                   res.render("videoPlayer.hbs",singleVideo);
               }
           
           });
        }
           
    });

});

router.get('/upload', (req, res) => {
    res.render("uploadVideo.hbs");
});


router.post('/upload', (req, res) => {
    let DB = req.app.locals.DB;

   let incomingData = {
        title:req.body.title,
        description:req.body.description,
        category:req.body.category,
        date:Date.now(),
        isPublished:false
    };
    
    DB.collection("videos").insertOne(incomingData, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/?videoUploaded=true");
        }
       
    });
    

});



module.exports = router;