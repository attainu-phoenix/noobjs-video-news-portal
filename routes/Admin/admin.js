"use strict";
const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
    
    res.render('adminLogin.hbs');
});

router.post('/login', (req, res) => {
    let email=req.body.email;
    let password=req.body.password;
    let DB = req.app.locals.DB;
    DB.collection("admin").findOne({ email : email}).toArray(function(error,admin)
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            for(i=0;i<admin.length;i++)
            {
                if(admin[i].email==email && admin[i].password==password)
                {
                    res.redirect('/admin/home');
                }
                else
                {
                    res.redirect('/admin/login');
                }
            }
        }
    });
    
});


router.get('/home', (req, res) => {
    
    let DB = req.app.locals.DB;
    DB.collection("videos").find({}).toArray(function(error,videos){
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
    res.render("adminApp.hbs");
    DB.collection("videos").findOne({_id()}).toArray(function(error,video){
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

router.post('/home/video', (req, res) => {
    let id=req._id;
    let DB = req.app.locals.DB;
    res.render("adminApp.hbs");
    DB.collection("videos").deleteOne({_id : ObjectId(_id)}).toArray(function(error,video){
        if(error){
            console.log(error);
        }
        else{
            
            
            res.redirect("adminPanel.hbs",data);
        }
    })
});


module.exports = router;