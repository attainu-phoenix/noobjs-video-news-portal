"use strict";
const express = require('express');

const router = express.Router();

const mongo=require('mongodb');

router.get('/login', (req, res) => {
    
    res.render('adminLogin.hbs');
});

router.post('/login', (req, res) => {
    let email=req.body.email;
    let password=req.body.password;
    let DB = req.app.locals.DB;
    let findAdmin={email : email, password : password};
    DB.collection("admin").find(findAdmin).toArray(function(error,admin)
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            res.redirect('/admin/home');
        }
    });
    
});


router.get('/home', (req, res) => {
    
    let DB = req.app.locals.DB;
    let findVideos={isPublished :false};
    DB.collection("videos").find(findVideos).toArray(function(error,videos){
        if(error){
            console.log(error);
        }
        else{
            
            let data={
                videos : videos
            }
            res.render("adminPanel.hbs",data);
        }
    })
});


router.get('/home/video', (req, res) => {
    let id=req.query.id;
    console.log(id);
    let DB = req.app.locals.DB;
    
    DB.collection("videos").find({_id : mongo.ObjectId(id)}).toArray(function(error,video){
        if(error){
            console.log(error);
        }
        else{
            console.log(video)
            let data={
                video : video
            }
            console.log(data);
            res.render("adminApp.hbs",data);
        }
    })
});

router.post('/home/video/reject', (req, res) => {
    let removeVideo={_id : mongo.ObjectId(req.body.videoId)};
    let DB = req.app.locals.DB;
   
    DB.collection("videos").remove(removeVideo);
        res.redirect('/admin/home');  
});

router.post('/home/video/approve', (req, res) => {
    let DB = req.app.locals.DB;
    let addVideo={_id : mongo.ObjectId(req.body.videoId)};
    
    DB.collection("videos").updateOne(
        addVideo,
        { $set: { isPublished : true } }
     );
    
    res.render("adminApp.hbs");
        res.redirect('/admin/home');  
});


module.exports = router;