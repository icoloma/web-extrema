
require('mongoose').connect('mongodb://localhost/extrema');

module.exports = function(server) {

  //El layout se implementa mediante 'extend layout' en jade
  server.set('view options', {
    layout: false
  });

  server.configure(function () {
    server.set('views', appPath + '/views');
  });

  //Variables locales: idioma y usuario
  server.all('*', function (req, res, next) {
    if(!req.originalUrl.match(/\.png|\.css|\.js|\.ico/))
      var lang = i18n.getLocale(req);

      res.local('lang', lang);
      res.local('user', req.user || '');
      next();
  });

  /*
  * IDIOMAS
  */

  //Cambio de idioma mediante cookie
  /**/
  server.get('/es', function (req, res, next) {
    var origin = req.header('Referer') || '/';

    res.cookie('language', 'es');
    res.redirect(origin);
  });

  server.get('/en', function (req, res, next) {
    var origin = req.header('Referer') || '/';

    res.cookie('language', 'en');
    res.redirect(origin);
  });

  server.get('/it', function (req, res, next) {
    var origin = req.header('Referer') || '/';

    res.cookie('language', 'it');
    res.redirect(origin);
  });

  /**/

  //Rutas de la parte estática
  var statics = require('./statics');
  statics(server);

};