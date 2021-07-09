const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const { Webhook } = require('discord-webhook-node');
const Discord = require('discord.js');
const assert = require("assert");
const ejs = require ("ejs");
const { kStringMaxLength } = require('buffer');
const fs = require ("fs")
const bcrypt = require ("bcrypt")
const config = require("./config.json");

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://Alex:ZicdzhMqwEHtbCT6@cluster0.bzmph.mongodb.net/myFirstDatabase")

var whileBool = true

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

function Update(){
  Note.find({}, function(err, partiCard) {
    partiCard.forEach (partiCard2 =>{
      app.get(`/${partiCard2._id}`, (req, res) =>{
        if (loggato === false){
          res.render("infoGioco", 
          {nome : partiCard2.title, devoloper : partiCard2.devoloper,
          img : partiCard2.logo, link : partiCard2.link, 
          desc : partiCard2.desc, 
          voti : partiCard2.voti })
        }
        else if (loggato === true){
          res.render ("infoGioco-loggato", 
            {nome : partiCard2.title, devoloper : partiCard2.devoloper,
            img : partiCard2.logo, link : partiCard2.link, 
            desc : partiCard2.desc, user : userName,
            voti : partiCard2.voti, id : partiCard2._id })
        }     
      })
    })
  })
}

while (whileBool === true) {
  Note.find({}, function(err, partiCard) {
    partiCard.forEach (partiCard2 =>{
      app.get(`/${partiCard2._id}`, (req, res) =>{
        if (loggato === false){
          res.render("infoGioco", 
          {nome : partiCard2.title, devoloper : partiCard2.devoloper,
          img : partiCard2.logo, link : partiCard2.link, 
          desc : partiCard2.desc, 
          voti : partiCard2.voti })
        }
        else if (loggato === true){
          res.render ("infoGioco-loggato", 
            {nome : partiCard2.title, devoloper : partiCard2.devoloper,
            img : partiCard2.logo, link : partiCard2.link, 
            desc : partiCard2.desc, user : userName,
            voti : partiCard2.voti, id : partiCard2._id })
        }     
      })
    })
  })
}