

module.exports = function(app) {


/*
* IDIOMAS
*/
//Pasar el idioma para la barra de navegación
app.all('*', function (req, res, next) {
    res.local('lang', i18n.getLocale(req));
    res.local('user', req.user || '')
    next();
});

//Cambio de idioma mediante cookie
/**/
app.get('/es', function (req, res, next) {
  var origin = req.header('Referer') || '/';

  res.cookie('language', 'es');
  res.redirect(origin);
});

app.get('/en', function (req, res, next) {
  var origin = req.header('Referer') || '/';

  res.cookie('language', 'en');
  res.redirect(origin);
});

app.get('/it', function (req, res, next) {
  var origin = req.header('Referer') || '/';

  res.cookie('language', 'it');
  res.redirect(origin);
});

/**/

//Rutas de la parte estática
var statics = require('./statics');
statics(app);

//Rutas de la zona de administración
var admin = require('./admin');
admin(app);


};