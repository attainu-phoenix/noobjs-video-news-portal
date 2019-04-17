"use strict";
const express = require('express');

const router = express.Router();

const mongo=require('mongodb');

var sess={};

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
                    sess=req.session;
                    sess.email=email;
                    sess.password=password;
                    res.redirect('/admin/home');
                }
            });
    
    });


router.get('/home', (req, res) => 
    {
        
        console.log(sess.email);
                let DB = req.app.locals.DB;
        if(sess.email&&sess.password)
        {
            
                DB.collection("videos").find({}).toArray(function(error,videos)
                {
                        let approvedVideos=[];
                        let unApprovedVideos=[]; 
                            if(error)
                                {
                                    console.log(error);
                                }
                            else
                                {
                                
                                
                                    for(var i=0;i<videos.length;i++)
                                    {
                                        if(videos[i].isPublished==true)
                                        {
                                        approvedVideos[i]=videos[i];
                                        }
                                        else if(videos[i].isPublished==false)
                                        {
                                            unApprovedVideos[i]=videos[i];
                                        }
                                    }
                                    
                                    let data={
                                        approvedVideos:approvedVideos,
                                        unApprovedVideos : unApprovedVideos
                                    }
                                    res.render("adminPanel.hbs",data);
                                
                                
                                }
                })
        }
        else
        {
            res.redirect("login/?notLoggedIn=true");
        }
    });


router.get('/home/video', (req, res) => 
    {
        
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
            let removeVideo={_id : mongo.ObjectId(req.body.videoId)};
            let DB = req.app.locals.DB;
        
            DB.collection("videos").remove(removeVideo);
                res.redirect('/admin/home');  
    });

    router.post('/home/video/approve', (req, res) => 
    {
            let DB = req.app.locals.DB;
            let addVideo={_id : mongo.ObjectId(req.body.videoId)};
            
            DB.collection("videos").updateOne
            (
                addVideo,
                { $set: {  title:req.body.title,description:req.body.description,category:req.body.category,isPublished :true } }
            );
            
            
                res.redirect('/admin/home');  
    });
    

    router.get('/logout', function(req, res, next) {
        if (req.session) {
          sess.email="";
          sess.password="";
          req.session.destroy(function(err) {
            if(err) {
              return next(err);
            } else {
              return res.redirect('login/?LoggedOut=true');
            }
          });
        }
      });


module.exports = router;