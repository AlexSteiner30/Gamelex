const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const { Webhook } = require('discord-webhook-node');
const assert = require("assert");
const ejs = require ("ejs");
const { kStringMaxLength } = require('buffer');

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
      res.render('index', {
          partiCardList: partiCard
      })
  })
})

app.get("/aggiungi", function(req, res){
  res.sendFile(__dirname + "/aggiungi.html")
})

app.get("/login", function(req, res){
  res.render("login")
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // check for missing filds
  if (!email || !password) {
    res.send("Please enter all the fields");
    return;
  }

  const doesUserExits = await User.findOne({ email });

  if (!doesUserExits) {
    res.send("invalid username or password");
    return;
  }

  const doesPasswordMatch = await bcrypt.compare(
    password,
    doesUserExits.password
  );

  if (!doesPasswordMatch) {
    res.send("invalid useranme or password");
    return;
  }

  // else he\s logged in
  req.session.user = {
    email,
  };

  res.redirect("/home");
})

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.listen(4000, function(){
  console.log("Server runna");
})