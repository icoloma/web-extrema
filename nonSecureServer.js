var http = module.exports = express.createServer();

// Configuration
http.configure(function(){
  http.set('views', __dirname + '/views');
  http.set('view engine', 'jade');
  http.use(express.logger());
  http.use(express.cookieParser());
  http.use(express.bodyParser());
  http.use(express.methodOverride());
  // http.use(express.session({ secret: 'Greedo no disparó primero' }));

  // http.use(passport.initialize());
  // http.use(passport.session());

  http.use(i18n.init);

  http.use(http.router);
  http.use(express.static(appPath + '/public'));
});



http.configure('development', function(){
  http.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

http.configure('production', function(){
  http.use(express.errorHandler());
});

//Ruta de login
http.get('/user', function (req, res) {
  res.redirect('https://localhost:4500/user');
});