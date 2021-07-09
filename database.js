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
var userName
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
    approvato: false,
    voti: 0

  });

  let gioco_id;

  newNote.save(function(err,gioco) {
    gioco_id = gioco.id;
 });

  console.log(gioco_id);
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


  var msg2 = `Nome: ${NomeGioco}\nDevoloper: <@${devoloper}>\nDescrizione: ${NomeGioco}\nID: ${gioco_id}`;


  console.log("Gioco Inviato con successo anche in privato agli staffer")

  //Hook2.send(msg2);
  //Hook2.send(infogioco)

  client.channels.cache.get(`858254918065455104`).send(msg2)
  res.render("aggiungi")
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
  res.render ("register")
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
              res.render ("login")
              register.save()
            }

            else if (result === true){
              //res.alert("La mail o il nome dell'utente sono già state utilizzate")
              res.render ("register2", {accountCreato : false})
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
      res.render ("login2")
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

              Update()
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

//Sito giochi
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
    //Voto
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
              var result = numeroVoti + 1
              console.log(result)
              console.log (userName)
              User.find ({}, function(err, partiUser){
  
                partiUser.forEach(partiUser2 =>{
                  if (partiUser2.userName === userName){
                    console.log("Sei tu")
                    if (partiUser2.votato === false){
                      client.channels.cache.get(`858254918065455104`).send(`${partiCard2.title} è stato votato! Ora ha ${result} voti, tra poco sarà aggiornata la sua pagina`)
                      Note.find({}, function(err, partiCard) {
                        partiCard.forEach(partiCard2 =>{
                          app.get(`/${partiCard2._id}`, ( req, res ) =>{
                              if (loggato === false){
                                  res.render("infoGioco", 
                                        {nome : partiCard2.title, devoloper : partiCard2.devoloper,
                                        img : partiCard2.logo, link : partiCard2.link, 
                                        desc : partiCard2.desc, 
                                        voti : partiCard2.voti })
                              }
                              else if (loggato === true){
                                  Vote()
                                  res.render ("infoGioco-loggato", 
                                    {nome : partiCard2.title, devoloper : partiCard2.devoloper,
                                    img : partiCard2.logo, link : partiCard2.link, 
                                    desc : partiCard2.desc, user : userName,
                                    voti : partiCard2.voti, id : partiCard2._id })
                              }
                          })
                      })
                    })
  
                      Note.findOneAndUpdate({_id: partiCard2._id}, {"voti": result},  function(err,data){
                        res.render ("infoGioco-loggato", 
                          {nome : partiCard2.title, devoloper : partiCard2.devoloper,
                          img : partiCard2.logo, link : partiCard2.link, 
                          desc : partiCard2.desc, user : userName,
                          voti : result, id : partiCard2._id })
                      })
                      User.findOneAndUpdate({userName: userName}, {"votato": true},  function(err,data){
                        console.log("Non puoi più votare")
                      })
                    }
        
                    else if (partiUser2.votato === true){
                      res.send ("Potrai votare domani")
                    }
                  }
                  else if(partiUser2.userName != user){
                    console.log("Non sei tu")
                  }
                  
                })     
              })
                     
            }
        })
  
    //Elimina
    partiCard.forEach(partiCard2 =>{
          app.get(`/${partiCard2._id}/elimina`, ( req, res ) =>{
            if (partiCard2.devoloper === userName){
              Note.findOneAndRemove({title: partiCard2.title },  function(err,data){
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
            }
  
            else if (partiCard.devoloper != userName){
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
            }
          })
        })
  
      }) 
  })
}

function Vote(){
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
//Server
const port = 5000;

app.listen(port, function(){
  console.log(`Server Runna sull porta ${port}`)

  var whileBool = true


  Update()

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
            Vote()
          }
    }
}


TimeCheck()
 
})

exports.userName = userName
exports.loggato = loggato

//Bot
client.login (config.token);


/*COSE MANCANTI:
 => modifica videogioco (poco importante sarà disponibile più avanti)
 => fixare il voto non fa update in tempo reale perchè non uso web socket, questo è un problema
*/
