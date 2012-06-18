

module.exports = function(server) {


  server.set('view options', {
    layout: appPath + '/views/layouts/layout'
  });

  /*
  * IDIOMAS
  */
  //Pasar el idioma para la barra de navegación
  server.all('*', function (req, res, next) {
      res.local('lang', i18n.getLocale(req));
      res.local('user', req.user || '')
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

  // //Rutas de la zona de administración
  // var admin = require('./admin');
  // admin(server);


};