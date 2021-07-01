const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const { Webhook } = require('discord-webhook-node');
const assert = require("assert");
const ejs = require ("ejs");
const { kStringMaxLength } = require('buffer');
const fs = require ("fs")
const bcrypt = require ("bcrypt")

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

const userSchema = {
  email : String,
  password : String,
  votato : Boolean
}

const Note = mongoose.model("Videogiochi-non-approvati", notesSchema)

const User = mongoose.model("login", userSchema)

 
app.get('/', (req, res) => {
  Note.find({}, function(err, partiCard) {
      res.render('index', {
          partiCardList: partiCard
      })
  })
})


app.post("/", function(req, res){
  let newNote = new Note({
    title: req.body.title,
    desc: req.body.desc,
    link: req.body.link,
    logo: req.body.logo,
    devoloper: req.body.devoloper,
    approvato: false

  });

  newNote.save();

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
  var LinkGioco = req.body.lnik;
  var DevoloperGioco = req.body.devoloper;
  var LogoGioco = req.body.logo;
  var DescGioco = req.body.desc;


  devoloper = DevoloperGioco;

  var msg2 = `Nome: ${NomeGioco}\nLink: ${LinkGioco} \nDevoloper: <@${devoloper}>\nDescrizione: ${NomeGioco}`;


  console.log("Gioco Inviato con successo anche in privato agli staffer")

  Hook2.send(msg2);

  
  res.sendFile(__dirname + "/aggiungi.html")
})

app.get("/index", (req, res) => {
  Note.find({}, function(err, partiCard) {
    res.render('games', {
        partiCardList: partiCard
    })
  })
})

app.get("/aggiungi", function(req, res){
  res.sendFile(__dirname + "/aggiungi.html")
})

app.get("/games", (req, res) => {
  Note.find({}, function(err, partiCard) {
      res.render('games', {
          partiCardList: partiCard
      })
  })
})

//Register

app.get("/Register", (req, res) =>{
  res.render("register")
})

app.post("/Register", function (req, res)  {
  var mail
  var password
  var userName

  mail = req.body.mail
  password = req.body.password
  userName = req.body.password
})
//Login

app.get("/login", async (req, res) => {
  res.render("login")

})

app.post ("/login", function(req, res) {

  var email
  var password

  email = req.body.email
  password = req.body.password

  const doesUserExits = User.findOne({ email });

  console.log(doesUserExits)
  if (!doesUserExits) {
    res.send ("La mail non esiste")
  } 

  if (doesUserExits){
    res.send ("La mail esiste")
  }
  
})

app.listen(4000, function(){
  console.log("Server runna");
})