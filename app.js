
/**
 * Module dependencies.
 */
var express = require('express');
 
//Paquetes globales
fs = require('fs'),
  mongoose = require('mongoose'),
  async = require('async'),
  _ = require('underscore'),
  i18n = require('i18n'),
  passport = require('passport');


var app = module.exports = express.createServer();

/*
* Variables globales
*/

//Ruta de la aplicación
appPath = __dirname;

//Idiomas
appLocales = ['en', 'es', 'it'];

/**/


/*
* Autenticación
*/

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    if(username === 'info' && password === 'foo') {
      return done(null, 'user')
    } else {
      return done(null, false, {message: 'Bad user/pass'})
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'Greedo no disparó primero' }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(i18n.init);

  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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
