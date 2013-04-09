appPath = '.';
var config = require('./config');
config.compileLessFiles();
setTimeout(config.minifyFiles,1000);
