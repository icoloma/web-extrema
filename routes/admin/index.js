/*
Rutas para la zona de administración
*/
mongoose.connect('mongodb://localhost/extrema');


module.exports = function (server) {
  var courses = require('./courses'),
    members = require('./members'),
    venues = require('./venues'),
    editions = require('./editions');


  server.all('/(.+)/', function (req, res, next) {
    if (req.isAuthenticated() || req.params[0] === '/user') { 
      next(); 
    } else {
      res.redirect('/user')
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
    res.redirect('http://localhost:4000');
  });

  courses(server);
  members(server);
  venues(server);
  editions(server);

};