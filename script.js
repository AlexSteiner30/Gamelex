function InviaGioco() { 
    
      var request = new XMLHttpRequest();
      request.open("POST", "https://discord.com/api/webhooks/857985572220043274/xx4pX7hvFvkri5i6OJJIBLtjhTD95nkExgR95xTf07hwFMPyWZNQ3An_CkyyVGVcJEOa");

      request.setRequestHeader('Content-type', 'application/json');


      var ruolo = "858018579218563092";
      var devoloper;

      var NomeGioco = document.getElementById("NomeGioco").value;
      var LinkGioco = document.getElementById("LinkGioco").value;
      var DevoloperGioco = document.getElementById("DevoloperGioco").value;
      var LogoGioco = document.getElementById("LogoGioco").value;
      var DescGioco = document.getElementById("DescrizioneGioco").value;

      devoloper = DevoloperGioco;

      var msg = `Ehi <@&${ruolo}>, ecco un nuovo gioco da approvare!\nNome: ${NomeGioco}\nDevoloper: <@${devoloper}>`;

      var params = {
        username: "Gamelex",
        avatar_url: "https://cdn.discordapp.com/attachments/838401093565284432/857986424362762280/WhatsApp_Image_2021-03-25_at_17.18.18.jpeg",
        content: msg
      }
      
      if(NomeGioco === ""){
        alert("Si prega di inserire il nome del gioco grazie");
      }

      if(LinkGioco === ""){
        alert("Si prega di inserire il link del gioco grazie");
      }

      if(DevoloperGioco === ""){
        alert("Si prega di inserire il devoloper del gioco grazie");
      }

      if(LogoGioco === ""){
        alert("Si prega di inserire il logo del gioco grazie");
      }

      if(DescGioco === "")
      {
        alert("Si prega di inserire la descrizione del gioco grazie");
      }

      else{
        console.log("Gioco Inviato con successo")
        request.send(JSON.stringify(params));
  
        InviaGiocoStaffChat();

        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("mydb");
          var myobj = { gioco: NomeGioco, link: LinkGioco,  };
          dbo.collection("customers").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
        });

      }

}


function InviaGiocoStaffChat() { 
  var request = new XMLHttpRequest();
  request.open("POST", "https://discord.com/api/webhooks/858255775248285726/DgZvLIZWxW-kKIctavprvIkY4isMJ4WoBYjtUkpI1JSWrJIXmOy86YSzu-7ak7p5F48S");
  request.setRequestHeader('Content-type', 'application/json');

  var devoloper;

  var NomeGioco = document.getElementById("NomeGioco").value;
  var LinkGioco = document.getElementById("LinkGioco").value;
  var DevoloperGioco = document.getElementById("DevoloperGioco").value;
  var LogoGioco = document.getElementById("LogoGioco").value;


  devoloper = DevoloperGioco;

  var msg = `Nome: ${NomeGioco}\nLink: ${LinkGioco}\nDevoloper: <@${devoloper}>`;

  var params = {
    username: NomeGioco,
    avatar_url: LogoGioco,
    content: msg
  }
  
  console.log("Gioco Inviato con successo anche in privato agli staffer")
  request.send(JSON.stringify(params));

}