

module.exports = function(app) {


/*
* IDIOMAS
*/
//Pasar el idioma para la barra de navegación
app.all('*', function (req, res, next) {
    res.local('lang', i18n.getLocale(req));
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
  res.redirect('/');
});

app.get('/it', function (req, res, next) {
  var origin = req.header('Referer') || '/';

  res.cookie('language', 'it');
  res.redirect('/');
});

/**/

//Rutas de la parte estática
var statics = require('./statics');
statics(app);

//Rutas de la zona de administración
var admin = require('./admin');
admin(app);


};