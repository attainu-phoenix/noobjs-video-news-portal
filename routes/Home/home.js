"use strict";
const express = require('express');
const router = express.Router();
const mongo = require("mongodb");


// Home Route For The Users 
router.get('/', (req, res) => {

    let homepageData = {};


    if(req.query.videoUploaded) {
        homepageData.videoUploaded = true
    }

    let DB = req.app.locals.DB;
    
    let mysort = { date: -1 };

     // Getting All Latest Videos From The DataBase 
    DB.collection("videos").find({isPublished:true}).limit(8).sort(mysort).toArray(function(error, latestvid) {
    
        if (error) {
            console.log(error);
        } else {
           homepageData.latest = latestvid;
        }  

         // Getting All Business Videos From The DataBase 

        DB.collection("videos").find({category:"business",isPublished:true}).limit(8).sort(mysort).toArray(function(error, business) {
    
            if (error) {
                console.log(error);
            } else {
                
               homepageData.business = business;  
            }
            
             // Getting All Political Videos From The DataBase 

            DB.collection("videos").find({category:"politics",isPublished:true}).limit(8).sort(mysort).toArray(function(error, politics) {
    
                if (error) {
                    console.log(error);
                } else {
                    
                   homepageData.politics = politics;
                }  

                 // Getting All Sports Videos From The DataBase 

                DB.collection("videos").find({category:"sports",isPublished:true}).limit(8).sort(mysort).toArray(function(error, sports) {
    
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


// Single Video Page Route For Users
router.get('/video/:id', (req, res) => {
    let DB = req.app.locals.DB;
    let singleVideo = {};
    let findThis = {_id:mongo.ObjectId(req.params.id)};
    let mysort = { date: -1 };
    
    DB.collection("videos").findOne(findThis, function(error,reqVideo) {
        if (error) {
          return console.log("error connecting to the collection ");
        } else {
            singleVideo.reqVideo = reqVideo;

           DB.collection("videos").find({category:reqVideo.category,isPublished:true}).limit(3).sort(mysort).toArray(function(error, relatedVid) {
           
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

// Upload Route For Users To Sumbit Their Videos
router.get('/upload', (req, res) => {
    res.render("uploadVideo.hbs");
});

//Getting The Data From The Frontend 
router.post('/upload', (req, res) => {
    let DB = req.app.locals.DB;

   let incomingData = {
        title:req.body.title,
        description:req.body.description,
        category:req.body.category,
        date:Date(),
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