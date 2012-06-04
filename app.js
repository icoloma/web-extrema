
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , management = require('./management');

var app = module.exports = express.createServer();

// Configuration

app.helpers({
  renderTeamList: function(teamArray) {
    var teamList = '';
      teamArray.forEach(function(person) { //map _template
        teamList = teamList +
         '<li><p>' + person.name +
         '</p><p>' + person.email +
         '</p>' +
         '<a class="btn">Edit</a></li>';
        })
        return teamList;
      },

  renderNewMember: function() {
    var fieldList = '<label>Name</label><input type="text" name="name"></input>';
    return fieldList;
  }
})

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes


app.get('/', routes.admin);
app.get('/admin/team', routes['admin-team']);
app.get('/admin/team/new', routes['admin-team-new']);
app.get('/admin/team/:member', routes['admin-team-member']);
app.get('/admin/team/:member/edit');
app.get('/admin/courses', routes['admin-courses']);
app.get('/admin/venues', routes['admin-venues']);

app.post('/admin/team/new/add', routes['admin-team-new-add']);


app.listen(4000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
