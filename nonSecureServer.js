

var lessMiddleware = require('less-middleware');

// Configuration
var http = module.exports = express.createServer(),
  config = require('./config');

http.configure(config.initial_config(http));

http.configure('development', config.dev_config(http));

http.configure('production', function(){
  http.use(express.errorHandler());
});

http.configure(config.final_config(http));


//Ruta de login
http.get('/user', function (req, res) {
  res.redirect('https://localhost:4500/user');
});