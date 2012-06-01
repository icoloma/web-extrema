var _ = require('underscore');
var management = require('../management');

_.extend(exports, {

  index: function(req, res){
    res.render('index', { title: 'extrema-sistemas.com' })
  },

  team: function(req, res){
    res.render('team', { title: 'Team' })
  },

  list: function(req, res){
    management.listMembers(function(err, items) {
        res.render('list', { 
          title: 'Current team members',
          members: items
        })
      });
  },

  newmember: function(req, res){
    res.render('newmember', { title: 'Add new member' })
  },

  addmember: function(req, res) {
    management.addMember(req.body);
    res.redirect('/');
  }

});
