/*
* Autenticación
*/
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    if(username === 'info@extrema-sistemas.com' && password === 'laureano2012') {
      return done(null, 'user');
    } else {
      return done(null, false, {message: 'Bad user/pass'});
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Configuration
var http = module.exports = express.createServer(),
  config = require('./config');

http.configure(function () {
    config.initial_config(http)();
    http.use(express.session({ secret: 'Greedo no disparó primero' }));
    http.use(passport.initialize());
    http.use(passport.session());
  });

http.configure('development', config.dev_config(http));

http.configure('production', config.prod_config(http));

http.configure(config.final_config(http));


// //Ruta de login
// http.get('/user', function (req, res) {
//   //Development
//   // res.redirect('https://192.168.2.122:4500/user');

//   //Production
//   res.redirect('https://' + req.header('host') + '/user');  
// });

//Helpers
http.helpers(require('./views/helpers'));