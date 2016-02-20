var config = require('./config.js');
var login = require("facebook-chat-api");
var fs = require("fs");
var request = require("request");

var options = {
  url: 'https://store.apicultur.com/api/nivelesVocabulario/1.0.0/3',
  headers: {
    'Authorization': 'Bearer BVdf_7koVr6EuDPMh4DC4ZOqPgoa'
  }
};

var resultado;

function get_palabra(error, response, body) {
  if (!error && response.statusCode === 200) {
    resultado = JSON.parse(body).palabra;
  } else {
    console.log("Error en conexión");
  }
}

// Create simple echo bot
login({email: config.USERNAME, password: config.PASSWORD}, function callback (err, api) {
  if(err) return console.error(err);

  api.setOptions({listenEvents: true});
  var msg = {};

  var stopListening = api.listen(function(err, event) {
    if(err) return console.error(err);

    switch(event.type) {
      case "message":
        if(event.body === '@help') {
          msg = {body:
            "\n\
@calla: Calla al ciclero \n\
@amorasofia: Información del grupo \n\
@denunciado: Te denuncia xd \n\
@palabra: Te dice una palabra culta pa desasnarte :v \n\
@sanmarcos: Te avisa cuanto falta para admisión \n\
            "};
          api.sendMessage(msg, event.threadID);
        }

        if(event.body === '@calla') {
          msg = {body: "Calla ciclero :v"};
          api.sendMessage(msg, event.threadID);
        }

        if(event.body === '@amorasofia') {
          msg = {body: "La mejor comunidad pre universitaria online ;)"};
          api.sendMessage(msg, event.threadID);
        }

        if(event.body === '@denunciado') {
          images = [];

          fs.readdir('img/', function (err, files) {
            if (err) throw err;
            files.forEach( function (file) {
              images.push(file);
            });
            numero_random = Math.floor(Math.random() * images.length);

            msg = {
              body: "",
              attachment: fs.createReadStream('img/' + images[numero_random])
            };
            api.sendMessage(msg, event.threadID);
          });
        }

        if(event.body === '@palabra') {
          request(options, get_palabra);
          msg = {body: resultado + '(Significado implementado próximamene)'};
          api.sendMessage(msg, event.threadID);
        }

        if(event.body === '@sanmarcos') {
          var bloque_ADF = (function() {
            oneDay = 24 * 60 * 60 * 1000;
            firstDate = new Date();
            secondDate = new Date(2016, 2, 12);
            result = firstDate.getTime() - secondDate.getTime();

            return Math.round(Math.abs(result) / (oneDay));
          })();

          var bloque_BCE = bloque_ADF + 1;

          msg = {body: 'No es por asustarte pulpín pero si eres bloque ADF faltan ' + bloque_ADF + ' días para tu masacre, si eres bloque BCE te faltan ' + bloque_BCE + ' días, bblb :\'v '};
          api.sendMessage(msg, event.threadID);
        }

        api.markAsRead(event.threadID, function(err) {
          if(err) console.log(err);
        });
        break;
      case "event":
        console.log(event);
        break;
    }
  });
});
