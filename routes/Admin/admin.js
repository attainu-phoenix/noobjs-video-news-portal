"use strict";
const express = require('express');

const router = express.Router();

const mongo=require('mongodb');



router.get('/login', (req, res) => {
    
    res.render('adminLogin.hbs');
});



router.post('/login', (req, res) => 
    {
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
                    let sess=req.session;
                    sess.email=email;
                    sess.password=password;
                    res.redirect('/admin/home');
                }
            });
    
    });


router.get('/home', (req, res) => 
    {
        
        let sess=req.session;
        let DB = req.app.locals.DB;
        
        if(sess.email&&sess.password)
        {
                let data={};
                DB.collection("videos").find({isPublished : true}).toArray(function(error,approvedVideos)
                {
                        
                            if(error)
                                {
                                    console.log(error);
                                }
                            else
                                {   
                                     data={
                                        approvedVideos:approvedVideos,
                                       
                                    }
                                    
                                }
                });
                DB.collection("videos").find({isPublished : false}).toArray(function(error,unApprovedVideos)
                {
                        
                            if(error)
                                {
                                    console.log(error);
                                }
                            else
                                {   
                                     data.unApprovedVideos=unApprovedVideos;
                                    
                                }
                                res.render("adminPanel.hbs",data);
                });
        }
        else
        {
            res.redirect("login/?notLoggedIn=true");
        }
    });


router.get('/home/video', (req, res) => 
    {
                let sess=req.session;
                let id=req.query.id;
                let DB = req.app.locals.DB;
                if(sess.email&&sess.password)
                {
                        DB.collection("videos").find({_id : mongo.ObjectId(id)}).toArray(function(error,video)
                        {
                            if(error){
                                console.log(error);
                            }
                            else
                            {
                                console.log(video)
                                let data={
                                    video : video
                                }
                                console.log(data);
                                res.render("adminApp.hbs",data);
                            }
                        })
            }
            else
            {
                res.redirect("login/?notLoggedIn=true");
            }
    
    });

router.post('/home/video/reject', (req, res) => 
    {
            let sess=req.session;
            if(sess.email&&sess.password)
            {
            let removeVideo={_id : mongo.ObjectId(req.body.videoId)};
            let DB = req.app.locals.DB;
        
            DB.collection("videos").remove(removeVideo);
                res.redirect('/admin/home');  
    
            }
            else
            {
                res.redirect('login/?notLoggedIn=true'); 
            }
    });

    router.post('/home/video/approve', (req, res) => 
    {       let sess=req.session;
            if(sess.email&&sess.password)
            {
            let DB = req.app.locals.DB;
            let addVideo={_id : mongo.ObjectId(req.body.videoId)};
            
            DB.collection("videos").updateOne
            (
                addVideo,
                { $set: {  title:req.body.title,description:req.body.description,category:req.body.category,isPublished :true,date:Date() } }
            );
            
            
                res.redirect('/admin/home');  
            }
            else
            {
                res.redirect('login/?notLoggedIn=true'); 
            }
    });
    

    router.get('/logout', function(req, res, next) {
        if (req.session) {
          
          req.session.destroy(function(err) {
            if(err) {
              return next(err);
            } else {
              res.redirect('login/?LoggedOut=true');
            }
          });
        }
      });


module.exports = router;