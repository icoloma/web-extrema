
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.helpers({
  renderTeam: function(teamArray) {
    var teamList = '';
    teamArray.forEach(function(person) {
      teamList = teamList +
                 '<li><p>' + person.name +
                 '</p><p>' + person.email+
                 '</p>'+
                 '<button class="btn">Edit</button></li>';
    })
    return teamList;
  }
})

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

  //app.get('/', routes.index);
app.get('/', routes.list);
  // app.get('/team', routes.team);
app.get('/addmember', routes.addmember);

app.listen(4000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
