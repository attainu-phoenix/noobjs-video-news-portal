"use strict";

let commentCount = 5 ;

let comments = [];

let VideoId = document.getElementById("videoId").value;

const updateContent = function () {
    let commentSection = document.getElementById("commentSection");
  
    for (let i = 0; i < commentCount; i++) {
    let h6 = document.createElement("h6");
    let p = document.createElement("p");

      h6.innerText = comments[i].name;
      p.innerText =  comments[i].commentContent;  
      
        commentSection.appendChild(h6);
        commentSection.appendChild(p);
    }
  };

let btn = document.getElementById("btn");
btn.addEventListener("click", function () {
  let name = document.getElementById("name").value;
  let commentContent = document.getElementById("comment").value;
  let userId = document.getElementById("userId").value;

 
  let data = {
    name: name,
    commentContent: commentContent,
    userId:userId
  };

   
  let request = new XMLHttpRequest();
  request.open("post", `/comments/${VideoId}`);

  // Tell browser and the server that we are sending JSON data
  request.setRequestHeader("content-type", "application/json");
  request.send(JSON.stringify(data));

  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      comments.push(data);
      commentCount = commentCount + 1;
      updateContent();
    }
  };
});

let viewMore = document.getElementById("view");
viewMore.addEventListener("click",function () {
    commentCount = commentCount + 5;
    updateContent();
});


const loadComments = function () {
    let request = new XMLHttpRequest();
    request.open("get", `/comments/${VideoId}`);
    request.send();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        comments = JSON.parse(request.responseText);
        updateContent();
      }
    };
  };
  
  loadComments();