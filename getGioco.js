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

mongoose.connect("mongodb+srv://Alex:ZicdzhMqwEHtbCT6@cluster0.bzmph.mongodb.net/myFirstDatabase")

app.get(`/${titolo}`, (req, res) =>{ res.render (`infoGioco`, {titoloInfo : titolo, descrizioneInfo : descrizione, linkInfo : link, devoloperInfo : devoloper, logoInfo : logo})})