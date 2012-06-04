var _ = require('underscore');
var db = require('../db').db;

_.extend(exports, {

  index: function(req, res){
    res.render('index', { title: 'extrema-sistemas.com' })
  },

  admin: function(req, res){
  res.render('admin', { title: 'Admin panel' })
  },

  team: function(req, res){
    res.render('team', { title: 'Team' })
  },

  'admin-team': function(req, res){
    db.listMembers(function(err, items) {
        res.render('admin-team', { 
          title: 'Current team members',
          members: items
        });
      });
  },

  'admin-team-new': function(req, res){
    res.render('admin-team-new', { title: 'Add new member' })
  },

  'admin-team-member': function(req, res) {
    res.render('admin-team-member', {
      title: req.params.member, 
      member: db.getMember({
        "name": req.params.member
      })
    });
  },

  'admin-team-new-add': function(req, res) {
    db.addMember(req.body);
    res.redirect('/admin/team');
  },

  'admin-courses': function(req, res){
    res.render('admin-courses', { title: 'Current courses' })
  },

  'admin-venues': function(req, res){
    res.render('admin-venues', { title: 'Current venues' })
  },



});
