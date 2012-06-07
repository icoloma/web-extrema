
/**
 * Module dependencies.
 */

var express = require('express');
  // , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration
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
require('./routes/admin.js')(app);

// app.get('/admin', routes.admin);
// app.get('/team', routes.adminTeam.index);
// app.get('/team/new', routes.adminTeam.newMember);
// app.get('/team/:member/edit', routes.adminTeam.editMember);
// // app.get('/team/:member', routes['admin-team-member']);
// app.get('/courses', routes['admin-courses']);
// app.get('/venues', routes['admin-venues']);

// app.post('/team/new/add', routes.adminTeam.addMember);
// app.post('/team/:member/update', routes.adminTeam.updateMember);
// app.post('/team/:member/delete', routes.adminTeam.deleteMember);

// //Imágenes
// // app.get('/team/:member/thumb', function(req,res) {
// //   res.redirect('/images/person.png')
// // });
// app.get('/team/:member/thumb', routes.adminTeam.picture);

app.listen(4000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
