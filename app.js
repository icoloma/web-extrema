
 
//Paquetes globales
express = require('express'),
  _ = require('underscore'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  async = require('async'),
  i18n = require('i18n'),
  passport = require('passport');

/*
* Variables globales
*/
//Ruta de la aplicación
appPath = __dirname;

//Idiomas
appLocales = ['en', 'es', 'it'];

/**/

//i18n
i18n.configure({
  locales: appLocales,
  register: global,
  cookie: 'language',
})

//Servidores
var http = require('./nonSecureServer'),
  https = require('./secureServer');

// Rutas
require('./routes')(http);
require('./routes')(https);
require('./routes/admin')(https); //Rutas de la parte de administración

//Exportar entorno (se copia por seguridad)
environment = http.settings.env.slice(0);

http.listen(4000, function(){
  console.log("Express server listening on port %d in %s mode", http.address().port, http.settings.env);
});

https.listen(4500, function(){
  console.log("Express server listening on port %d in %s mode", https.address().port, https.settings.env);
});
