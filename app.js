
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


app.get('/admin', routes.admin);
app.get('/team', routes.adminTeam.index);
app.get('/team/new', routes.adminTeam.newMember);
app.get('/team/:member/edit', routes.adminTeam.editMember);
// app.get('/team/:member', routes['admin-team-member']);
app.get('/courses', routes['admin-courses']);
app.get('/venues', routes['admin-venues']);

app.post('/team/new/add', routes.adminTeam.addMember);
app.post('/team/:member/update', routes.adminTeam.updateMember);
app.post('/team/:member/delete', routes.adminTeam.deleteMember);


app.listen(4000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
