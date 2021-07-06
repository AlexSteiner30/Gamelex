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
               message.channel.send("Il gioco è stato approvato correttamente!")

               fs.writeFile("prova.html", "Hey there!", function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });

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