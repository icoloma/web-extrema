var _ = require('underscore');
var db = require('../manage').db;

_.extend(exports, {

  index: function(req, res){
    res.render('index', { title: 'extrema-sistemas.com' })
  },

  team: function(req, res){
    res.render('team', { title: 'Team' })
  },

  list: function(req, res){
    db.
      collection('persons').
      find().
      toArray(function(er, items) {
        res.render('list', { 
          title: 'Current team members',
          members: items
        })
      });
  },

  addmember: function(req, res){
    res.render('addmember', { title: 'Add new member' })
  }


});
