/*
Rutas para la zona de administración
*/
mongoose.connect('mongodb://localhost/extrema');


module.exports = function (app) {
  var courses = require('./courses'),
    members = require('./members'),
    venues = require('./venues'),
    editions = require('./editions');

  app.set('view options', {
    layout: appPath + '/views/layouts/layout-admin'
  });

  app.configure(function () {
    app.set('views', appPath + '/views/admin');
  });

  //Página principal
  app.get('/admin', function (req, res) {
    res.render('index', { title: 'Admin panel' });
  });

  courses(app);
  members(app);
  venues(app);
  editions(app);

};