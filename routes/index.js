
require('mongoose').connect('mongodb://nodejitsu_extrema:dr95qimrm2ularqs17ld5dmom4@ds051947.mongolab.com:51947/nodejitsu_extrema_nodejitsudb5861399879');

module.exports = function(server) {

  //El layout se implementa mediante 'extend layout' en jade
  server.set('view options', {
    layout: false
  });

  server.configure(function () {
    server.set('views', appPath + '/views');
  });


  // Esto es MUY cutre
  var ASSETS_FILTER = /\.png|\.css|\.js|\.ico|\.woff|\.ttf|\.svg|\.pdf|\.jpg|\.eog|\.ico|\.txt|\/thumb/
  , BASIC_NAVIGATION_FILTER = /^\/es$|^\/en$|^\/it$|^\/cookies$/
  ;

  //Variables locales: idioma, usuario y cookies
  server.all('*', function (req, res, next) {
    if (ASSETS_FILTER.test(req.originalUrl)) return next();

    var lang = i18n.getLocale(req) || 'en';

    res.local('lang', lang);
    res.local('user', req.user || '');

    // FALLO: en un redirect, hace los dos "pasos" seguidos, pero no es importante
    if (
      req.cookies.acceptscookies === 'prompted' &&
      !BASIC_NAVIGATION_FILTER.test(req.originalUrl)
    ) {
      res.cookie('acceptscookies', 'accepted', {maxAge: 1000*3600*24*365*10});
      res.local('acceptsCookies', true);
    } else if (req.cookies.acceptscookies === 'accepted') {
      res.local('acceptsCookies', true);
    } else {
      res.cookie('acceptscookies', 'prompted', {maxAge: 1000*3600*24*7});
      res.local('promptCookies', true);
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

    if (req.cookies.acceptscookies === 'prompted') res.cookie('acceptscookies', undefined);
    res.cookie('language', 'es');
    res.redirect(origin);
  });

  server.get('/en', function (req, res, next) {
    var origin = req.header('Referer') || '/';

    if (req.cookies.acceptscookies === 'prompted') res.cookie('acceptscookies', undefined);
    res.cookie('language', 'en');
    res.redirect(origin);
  });

  server.get('/it', function (req, res, next) {
    var origin = req.header('Referer') || '/';

    if (req.cookies.acceptscookies === 'prompted') res.cookie('acceptscookies', undefined);
    res.cookie('language', 'it');
    res.redirect(origin);
  });

  /**/

  //Rutas de la parte estática
  var statics = require('./statics');
  statics(server);

};
