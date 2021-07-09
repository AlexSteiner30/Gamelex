const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

var whileBool = true

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://Alex:ZicdzhMqwEHtbCT6@cluster0.bzmph.mongodb.net/myFirstDatabase")

const userSchema = {
  email : String,
  password : String,
  userName : String,
  votato : Boolean
}
  
const User = mongoose.model("login", userSchema)

function TimeCheck(){
    var currentTime = new Date();
    hours = currentTime.getHours();
    mins = currentTime.getMinutes();
    
    while (whileBool === true) {
  
      if (hours === 24 && mins === 0){
            console.log("Ora tutti gli user posso votare :D")
        
            User.find ({}, function(err, partiUser){
              partiUser.forEach(partiUser2 =>{ 
                User.findOneAndUpdate({_id: partiUser2._id}, {"votato": false},  function(err,data){
                  console.log("Puoi votare!")
                })
              })
            })
          }
          
      else if (hours != 24 && mins != 0){
            
          }
    }
}


TimeCheck()
