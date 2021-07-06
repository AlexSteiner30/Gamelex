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

var user
var loggato = false;

var url = "mongodb+srv://Alex:ZicdzhMqwEHtbCT6@cluster0.bzmph.mongodb.net/myFirstDatabase";

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://Alex:ZicdzhMqwEHtbCT6@cluster0.bzmph.mongodb.net/myFirstDatabase")

const client = new Discord.Client();


let prefix = "!";

const notesSchema ={
  logo: String,
  title: String,
  desc: String,
  link: String,
  devoloper: String,
  approvato: Boolean
}

const userSchema = {
  email : String,
  password : String,
  userName : String,
  votato : Boolean
}


const Note = mongoose.model("Videogiochi-non-approvati", notesSchema)

const User = mongoose.model("login", userSchema)

 
app.get('/', (req, res) => {
  Note.find({}, function(err, partiCard) {
    if (loggato === true){
      res.render ("games-login", {user : userName, partiCardList: partiCard})
    }
    else if (loggato === false){
      res.render('games', {
        partiCardList: partiCard
    })
    }
  })
})

app.get("/aggiungi", (req, res) => {
  if (loggato === true){
    res.sendFile (__dirname + "/aggiungi.html")
  }

  else if (loggato === false){
    Note.find({}, function(err, partiCard) {
      res.render ("games", {partiCardList : partiCard})
    })
  }
})

app.post("/aggiungi", function(req, res){
  let newNote = new Note({
    title: req.body.title,
    desc: req.body.desc,
    link: req.body.link,
    logo: req.body.logo,
    devoloper: userName,
    approvato: false

  });

  var idGioco

  newNote.save(function(err,gioco) {
    console.log(gioco.id);
    idGioco = gioco.id;
 });

  console.log("Salvato, db aggiornato!")

  const Hook1 = new Webhook("https://discord.com/api/webhooks/857985572220043274/xx4pX7hvFvkri5i6OJJIBLtjhTD95nkExgR95xTf07hwFMPyWZNQ3An_CkyyVGVcJEOa");
 
  var ruolo = "858018579218563092";
  var devoloper;

  var NomeGioco = req.body.title;
  var LinkGioco = req.body.lnik;
  var DevoloperGioco = req.body.devoloper;
  var LogoGioco = req.body.logo;
  var DescGioco = req.body.desc;

  devoloper = DevoloperGioco;

  var msg = `Ehi <@&${ruolo}>, ecco un nuovo gioco da approvare!\nNome: ${NomeGioco}\nDevoloper: <@${devoloper}>`;

  
  console.log("Gioco Inviato con successo")
  Hook1.send(msg);

  const Hook2 = new Webhook("https://discord.com/api/webhooks/858255775248285726/DgZvLIZWxW-kKIctavprvIkY4isMJ4WoBYjtUkpI1JSWrJIXmOy86YSzu-7ak7p5F48S");
  
  var devoloper;

    
  var NomeGioco = req.body.title;
  var LinkGioco = req.body.link;
  var DevoloperGioco = req.body.devoloper;
  var LogoGioco = req.body.logo;
  var DescGioco = req.body.desc;

  devoloper = DevoloperGioco;


  var msg2 = `Nome: ${NomeGioco}\nDevoloper: <@${devoloper}>\nDescrizione: ${NomeGioco}\n ID: ${idGioco}`;

  const infogioco = new Discord.MessageEmbed()
  .setTitle(`${NomeGioco}`)
  .setURL (`${LinkGioco}`)
  .setDescription(`Devoloper ${userName}\n Descrizione: ${DescGioco}\n ID: ${idGioco}` )

  console.log("Gioco Inviato con successo anche in privato agli staffer")

  //Hook2.send(msg2);
  //Hook2.send(botInfo)

  client.channels.cache.get(`858254918065455104`).send(infogioco)
  res.sendFile(__dirname + "/aggiungi.html")
})


app.get("/index", (req, res) => {
  Note.find({}, function(err, partiCard) {
    if (loggato === true){
      res.render ("games-login", {user : userName, partiCardList: partiCard})
    }
    else if (loggato === false){
      res.render('games', {
        partiCardList: partiCard
    })
    }
  })
})


app.get("/aggiungi", function(req, res){
  res.sendFile(__dirname + "/aggiungi.html")
})

app.get("/games", (req, res) => {
  Note.find({}, function(err, partiCard) {
    if (loggato === true){
      res.render ("games-login", {user : userName, partiCardList: partiCard})
    }
    else if (loggato === false){
      res.render('games', {
        partiCardList: partiCard
    })
    }
  })
})

//Register

app.get("/Register", (req, res) =>{
  res.render("register")
})

app.post("/Register", function (req, res)  {

  var mailCheck = req.body.email
  var UserNameCheck = req.body.Username


  let register = new User({
    email :  req.body.email,
    password : req.body.password,
    userName : req.body.Username,
    votato : false
  })

  User.exists({ userName: `${req.body.Username}` }, function(err, result) {
    if (err) {
      res.send("Abbio riscontrato un errore");
    } else {

      console.log (result)


       
      User.exists({ email: `${req.body.email}` }, function(err, result) {
          if (err) {
            res.send("Abbio riscontrato un errore");
          }
          else{
            if (result === false){
              res.send("Account create con successo");
              res.render("index")
              register.save()
            }

            else if (result === true){
              res.send ("La mail o il nome dell'utente sono già state utilizzate")
              res.render ("index")
            }
          }
        })
      
    }
  })
})

//Login

app.get("/login", async (req, res) => {
  res.render("login")

})

app.post ("/login", (req, res) => {

  var password

  userName = req.body.user
  password = req.body.password

  User.exists({ userName: `${req.body.user}`, password:  `${req.body.password}` }, function(err, result) {
    if (err){
      res.send ("Abbiamo riscontrato un errore")
    }
    else if (result === true){
      loggato = true;
      Note.find({}, function(err, partiCard) {
        res.render ("games-login", {user : req.body.user, partiCardList: partiCard})
      })
    }
    else if (result === false){
      res.send ("La mail o la password non sono corrette!")
    }
  })
  
})

//Logout 

app.get("/logout", (req, res) =>{
  loggato = false
  Note.find({}, function(err, partiCard) {
    res.render('games', {
        partiCardList: partiCard
    })
    
  })
})

//User

app.get("/user", (req, res) => {
  Note.find({}, function(err, partiCard) {
    if (loggato === true){
      res.render ("userProfile", 
      {user : userName, partiCardList: partiCard})
    }
    else if (loggato === false){
      res.render('games', {
        partiCardList: partiCard
    })
    }
  })
})

//Info Gioco 

//Server

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server Runna sull porta ${port}`));


client.login (config.token);
console.log(`Ciao`)