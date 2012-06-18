var privateKey = fs.readFileSync('./https/lalala.key'),
  certificate = fs.readFileSync('./https/lalala.crt');


/*
* Autenticación
*/
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    if(username === 'info' && password === 'foo') {
      return done(null, 'user')
    } else {
      return done(null, false, {message: 'Bad user/pass'})
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
var https = express.createServer({key: privateKey, cert: certificate});

https.configure(function () {
  https.set('views', __dirname + '/views');
  https.set('view engine', 'jade');
  https.use(express.logger());
  https.use(express.cookieParser());
  https.use(express.bodyParser());
  https.use(express.methodOverride());
  https.use(express.session({ secret: 'Greedo no disparó primero' }));

  https.use(i18n.init);

  https.use(passport.initialize());
  https.use(passport.session());

  https.use(express.static(__dirname + '/public'));
});

//Helpers
https.helpers(require('./views/helpers'));

// //i18n
// i18n.configure({
//   locales: appLocales,
//   register: global,
//   cookie: 'language',
// })

module.exports = https;