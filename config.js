var lessMiddleware = require('less-middleware');

exports.initial_config = function(app) {

  return function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(i18n.init);
  };
};

exports.final_config = function (app) {
  return function () {
    app.use(app.router);
    app.use(express.static(appPath + '/public'));
  };
};

exports.dev_config = function (app) {
  return function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(lessMiddleware({src: appPath + '/public' }));
  };
};