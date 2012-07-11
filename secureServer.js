var privateKey = fs.readFileSync('./https/lalala.key'),
  certificate = fs.readFileSync('./https/lalala.crt');


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

//Configurar server
var https = express.createServer({key: privateKey, cert: certificate}),
  config = require('./config');

https.configure(function() {
  config.initial_config(https)();
  https.use(express.session({ secret: 'Greedo no disparó primero' }));
  https.use(passport.initialize());
  https.use(passport.session());
});

https.configure('development', config.dev_config(https));

https.configure('production', config.prod_config(https));

https.configure(config.final_config(https));

//Helpers
https.helpers(require('./views/helpers'));

module.exports = https;