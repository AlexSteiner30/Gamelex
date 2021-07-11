const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const { Webhook } = require('discord-webhook-node');
const Discord = require('discord.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const config = require("./config.json");

mongoose.connect("mongodb+srv://Alex:ZicdzhMqwEHtbCT6@cluster0.bzmph.mongodb.net/myFirstDatabase")

const notesSchema ={
  logo: String,
  title: String,
  desc: String,
  link: String,
  devoloper: String,
  approvato: Boolean,
  voti: Number
}

const userSchema = {
  email : String,
  password : String,
  userName : String,
  votato : Boolean
}


const Note = mongoose.model("Videogiochi-non-approvati", notesSchema)

const User = mongoose.model("login", userSchema)

function Time(){
  var whileBool = true

  var currentTime = new Date();
  var hours = currentTime.getHours();
  var mins = currentTime.getMinutes();
    
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
  
//Server
var server = http.listen(process.env.PORT || 4000, () => {
  console.log('server is running on port', server.address().port);


  Time()
 
});
