
/**
 * Module dependencies.
 */
var express = require('express');
 
//Paquetes globales
fs = require('fs'),
  mongoose = require('mongoose'),
  async = require('async'),
  _ = require('underscore'),
  i18n = require('i18n');


var app = module.exports = express.createServer();

//Guarda la ruta de la aplicación
appPath = __dirname;

//Idiomas para la web
appLocales = ['en', 'es', 'it'];

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "Greedo no disparó primero" }));

  app.use(i18n.init);

  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger());
});


//Helpers
app.helpers(require('./views/helpers'));

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//i18n
i18n.configure({
  locales: appLocales,
  register: global,
  cookie: 'language',
})


// Rutas
require('./routes')(app);


app.listen(4000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
