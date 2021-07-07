const Discord = require("discord.js");
const config = require("./config.json");
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const objectId = require("mongoose").objectID;
const bodyParser = require("body-parser")
const { Webhook } = require('discord-webhook-node');
const assert = require("assert");
const ejs = require ("ejs");
const { kStringMaxLength } = require('buffer');
const fs = require ("fs")


const client = new Discord.Client();

let prefix = "!";

var url = "mongodb+srv://Alex:ZicdzhMqwEHtbCT6@cluster0.bzmph.mongodb.net/myFirstDatabase";

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://Alex:ZicdzhMqwEHtbCT6@cluster0.bzmph.mongodb.net/myFirstDatabase")

const notesSchema ={
    logo: String,
    title: String,
    desc: String,
    link: String,
    devoloper: String,
    approvato: Boolean
  }
  
const Note = mongoose.model("Videogiochi-non-approvati", notesSchema)

var titolo
var descrizione
var link
var devoloper
var logo 

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === 'approva') {
		if (!args.length) {
			return message.channel.send(`Scrivi l'id del videogioco, ${message.author}!`);
		}
        
        Note.findOneAndUpdate({_id: args}, {"approvato": true},  function(err,data)
        {
            if(!err){
                var nome
                message.channel.send("Il gioco è stato approvato correttamente!")

                Note.findById({_id : args}, (error, data) =>{
                    titolo = data.title
                    descrizione = data.desc
                    link = data.link
                    devoloper = data.devoloper
                    logo = data.logo
                })

                
//Info Gioco 
Note.find({}, function(err, partiCard) {
    partiCard.forEach(partiCard2 =>{
      app.get(`/${partiCard2._id}`, ( req, res ) =>{
        if (loggato === false){
          res.render("infoGioco", 
          {nome : partiCard2.title, devoloper : partiCard2.devoloper,
          img : partiCard2.logo, link : partiCard2.link, 
          desc : partiCard2.desc, user : userName,
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
  
    partiCard.forEach(partiCard2 =>{
      app.get(`/${partiCard2._id}/vota`, ( req, res ) =>{
        if (loggato === false) {
          res.render("infoGioco", 
          {nome : partiCard2.title, devoloper : partiCard2.devoloper,
          img : partiCard2.logo, link : partiCard2.link, 
          desc : partiCard2.desc, user : userName,
          voti : partiCard2.voti })
        }
        else if (loggato === true){
          var numeroVoti = partiCard2.voti
          console.log(numeroVoti)
          numeroVoti + 1 //Non aggiunge il voto
          console.log(numeroVoti)
          Note.findOneAndUpdate({_id: partiCard2._id}, {"voti": numeroVoti},  function(err,data){}
          )
          Note.findOneAndUpdate({_id: partiCard2._id}, {"voti": numeroVoti},  function(err,data){}
          )
        }
      })
    })
  })

            }

            else{
                message.channel.send("E' stato riscontrato un errore, prova a veder se l id era corretto!")
            }
        
        });

}

    else if (command === 'rifiuta') {
		if (!args.length) {
			return message.channel.send(`Scrivi l'id del videogioco, ${message.author}!`);
		}

        Note.findOneAndRemove({_id: args},  function(err,data)
        {
            if(!err){
               message.channel.send("Il gioco è stato eliminato correttamente!")
            }

            else{
                message.channel.send("E' stato riscontrato un errore, prova a veder se l id era corretto!")
            }
        
        });


    }
});
client.login (config.token);