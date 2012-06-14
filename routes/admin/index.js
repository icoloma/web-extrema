/*
Rutas para la zona de administración
*/
mongoose.connect('mongodb://localhost/extrema');


module.exports = function (app) {
  var courses = require('./courses'),
    members = require('./members'),
    venues = require('./venues'),
    editions = require('./editions');

  //Página principal
  app.get('/admin', function (req, res) {
    res.render('admin/index', { title: 'Admin panel' });
  });

  courses(app);
  members(app);
  venues(app);
  editions(app);

};