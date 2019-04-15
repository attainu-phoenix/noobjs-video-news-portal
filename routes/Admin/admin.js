"use strict";
const express = require('express');

const router = express.Router();

const mongodb=require('mongodb');

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
    let findVideos={isPublished : false};
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
    let DB = req.app.locals.DB;
    let findVideo={_id : ObjectId('"'+req.params._id+'"')};
    DB.collection("videos").findOne(findVideo).toArray(function(error,video){
        if(error){
            console.log(error);
        }
        else{
            
            let data={
                video : video
            }
            res.render("adminApp.hbs",data);
        }
    })
});

router.post('/home/video/reject', (req, res) => {
    let removeVideo={_id : ObjectId('"'+req.body.videoId+'"')};
    let DB = req.app.locals.DB;
    DB.collection("videos").remove(removeVideo);
        res.redirect('admin/home');  
});

router.post('/home/video/approve', (req, res) => {
    let addVideo={_id : ObjectId('"'+req.body.videoId+'"')};
    DB.collection("videos").updateOne(
        addVideo,
        { $set: { isPublished : "true" } }
     );
    let DB = req.app.locals.DB;
    res.redirect('admin/home');  
});


module.exports = router;