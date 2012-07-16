/*
Rutas para la zona de administración
*/

module.exports = function (server) {

  var adminZone = /edit|delete|add|new|admin|venues|update|editions/;

  server.get(adminZone, function (req, res, next) {
    if (req.user || req.url === '/user') { 
      next(); 
    } else {
      res.redirect('/user');
    }
  });

  //Página principal
  server.get('/admin', function (req, res) {
    res.render('admin/index', { title: 'Admin panel' });
  });

  //Login
  server.get('/user', function (req, res) {
    res.render('admin/login', {title: 'Login'});
  });

  server.post('/login', 
    passport.authenticate('local', { failureRedirect: '/user', failureFlash: true }),
    function(req, res) {
      res.redirect('/');
  });

  server.get('/logout', function (req, res) {
    req.logout();

      // Development
      // res.redirect('http://192.168.2.122:4000');

      // Production
    res.redirect('/');
  });


  var courses = require('./courses'),
    members = require('./members'),
    venues = require('./venues'),
    editions = require('./editions'),
    studies = require('./studies');

  courses(server);
  members(server);
  studies(server);
  venues(server);
  editions(server);
};