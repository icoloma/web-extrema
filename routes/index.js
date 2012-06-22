

module.exports = function(server) {


  server.set('view options', {
    layout: false
  });

  /*
  * IDIOMAS
  */
  //Pasar el idioma para la barra de navegación
  server.all('*', function (req, res, next) {
    var lang = i18n.getLocale(req),
      other_langs = appLocales
                      .slice(0);
      other_langs.splice(other_langs.indexOf(lang), 1);

    res.local('lang', lang);
    res.local('user', req.user || '');
    res.local('other_langs', other_langs);
    next();
  });

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