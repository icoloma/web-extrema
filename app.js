
/**
 * Module dependencies.
 */
var express = require('express');
 
//Paquetes globales
fs = require('fs'),
  mongoose = require('mongoose'),
  async = require('async'),
  _ = require('underscore');


var app = module.exports = express.createServer();

app.path = __dirname;

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Rutas
require('./routes/admin.js')(app);


app.listen(4000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
