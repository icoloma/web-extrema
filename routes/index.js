
require('mongoose').connect('mongodb://nodejitsu_extrema:dr95qimrm2ularqs17ld5dmom4@ds051947.mongolab.com:51947/nodejitsu_extrema_nodejitsudb5861399879');

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
    if(!req.originalUrl.match(/\.png|\.css|\.js|\.ico/)) {
      var lang = i18n.getLocale(req) || 'en';

      res.local('lang', lang);
      res.local('user', req.user || '');
    }
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
