var less = require('less')
  , fs = require('fs')
;

/*
* CONFIGURACIÓN DE LOS SERVIDORES
*
*Separada en dos bloques comunes, 'initial' y 'final',
*y dos bloques particulares para cada entorno (producción o desarrollo)
*
*/

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
    
    //Compilar los .less con cada nueva petición en 'development'
    app.use(function (req, res, next) {
      if(!req.originalUrl.match(/\.png|\.css|\.js|\.ico|\.jpg|\/thumb/)) {
        compileLessFiles();
      }
      next();
    });
  };
};

exports.prod_config = function (app) {
  return function () {
    app.use(express.errorHandler());

    app.error(function (err, req, res, next) {
      res.render('statics/500', {
        title: __('500-title'),
        status: 500
    });
  });
  };
};


/* Helpers para precompilar */

var bootstrapPath = appPath + '/less/bootstrap/less',
  lessPath = appPath + '/less',
  cssPath = appPath + '/public/stylesheets',
  jsPath = appPath + '/public/javascripts',
  compressor = require('node-minify');

  if (!fs.existsSync(cssPath)) {
    fs.mkdirSync(cssPath);
  }

//Procesa un fichero .less
var compileLessFile = function(lessFile, cssFile) {

  //Asume que los imports están en la misma carpeta que el fichero
  //o en una carpeta 'modules'
  var code = fs.readFileSync(lessFile, 'utf-8'),
    path = lessFile.slice(0, lessFile.lastIndexOf('/'));

  less.render(code, {paths: [path, path + '/modules']}, function (err, css) {
    if(err) {
      console.log(err);
    }
    fs.writeFileSync(cssFile, css);
  });
};

exports.compileLessFiles = function () {

  //Ficheros de Bootstrap
  compileLessFile(bootstrapPath + '/bootstrap.less', cssPath + '/bootstrap.css')
  compileLessFile(bootstrapPath + '/responsive.less', cssPath + '/bootstrap-responsive.css')

  //Resto de ficheros en la carpeta de stylesheets
  var files = fs.readdirSync(lessPath);

  files.forEach(function (file) {
    if(file.match(/less$/)) {
      var noExtension = file.split('.less')[0];
      compileLessFile(lessPath + '/' + file, cssPath + '/' + noExtension + '.css');
    }
  });

};

exports.minifyFiles = function() {

  new compressor.minify({
      type: 'yui-css',
      fileIn: [cssPath + '/bootstrap.css',
               cssPath + '/bootstrap-responsive.css',
               cssPath + '/style.css'],
      fileOut: cssPath + '/style.min.css',
      callback: function(err){
          if(err) {
            console.log(err);
          }
          else {
            console.log('Hojas de estilo compiladas...\n');
          }
      }
  });

  new compressor.minify({
      type: 'yui-js',
      fileIn: [jsPath + '/jquery-1.7.2.min.js',
               jsPath + '/bootstrap-tab.js',
               jsPath + '/bootstrap-dropdown.js',
               jsPath + '/bootstrap-collapse.js',
               jsPath + '/touch-devices.js'],
      fileOut: jsPath + '/scripts.min.js',
      callback: function(err) {
          if(err) {
            console.log(err);
          }
          else {
            console.log('Scripts compilados...\n');
          }
      }
  });
};
