var less = require('less');

exports.initial_config = function(app) {

  return function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    compileLessFiles();

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
    
    // app.get('*', function (req, res, next) {
    //   console.log(req.originalUrl)
    //   if(!req.originalUrl.match(/\.png|\.css|\.js|\.ico/))
    //     compileLessFiles();
    //     next();
    // });
  };
};

exports.prod_config = function (app) {
  return function () {
    app.use(express.errorHandler());
  };
};


/* Helpers para precompilar */

var compileLessFile = function(lessFile, cssFile) {
  //Se asume que los imports está en la misma carpeta
  var code = fs.readFileSync(lessFile, 'utf-8'),
    path = lessFile.slice(0, lessFile.lastIndexOf('/'));
  less.render(code, {paths: [path]}, function (err, css) {
    fs.writeFileSync(cssFile, css);
  })
}

var bootstrapPath = appPath + '/public/bootstrap/less',
  cssPath = appPath + '/public/stylesheets';

var compileLessFiles = function () {
  compileLessFile(bootstrapPath + '/bootstrap.less', cssPath + '/bootstrap.css')
  compileLessFile(bootstrapPath + '/responsive.less', cssPath + '/bootstrap-responsive.css')

  var files = fs.readdirSync(cssPath);

  files.forEach(function (file) {
    if(file.match(/less/)) {
      var noExtension = file.split('.less')[0];
      compileLessFile(cssPath + '/' + file, cssPath + '/' + noExtension + '.css')
    }
  })

}