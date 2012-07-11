

// Configuration
var http = module.exports = express.createServer(),
  config = require('./config');

http.configure(config.initial_config(http));

http.configure('development', config.dev_config(http));

http.configure('production', config.prod_config(http));

http.configure(config.final_config(http));


//Ruta de login
http.get('/user', function (req, res) {
  //Development
  res.redirect('https://192.168.2.122:4500/user');

  //Production
  // res.redirect('https://' + req.header('host') + '/user');  
});

//Helpers
http.helpers(require('./views/helpers'));