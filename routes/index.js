var _ = require('underscore'),
 // db = require('../db').db,
 dv = require('../db/models');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/extrema');

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
    dv.Member.find({},function(err, items) {
      res.render('admin-team', {
        title: 'Current team members'
      , members: items
      })
    });
    // db.listMembers(function(err, items) {
    //     res.render('admin-team', { 
    //       title: 'Current team members',
    //       members: items
    //     });
    //   });
  },

  'admin-team-new': function(req, res){
    res.render('admin-team-new', { title: 'Add new member' })
  },

  'admin-team-member': function(req,res) {
    res.render('admin-team-member', {
      title: req.params.member,
      member: dv.Member.find({"name" : req.params.member})
    })
  },

  'admin-team-member-edit': function(req, res) {
    res.render('admin-team-member-edit', {
      title: req.params.member, 
      member: db.getMember({
        "name": req.params.member
      })
    });
  },

  'admin-team-new-add': function (req, res) {
    member = new dv.Member();
    input = req.body;
    _.extend(member, {
      name: input.name,
      email: input.email,
      type: input.type,
      social: [input['social-twitter'], input['social-blog']],
      description: [input['description-es'], input['description-en']]
    })
    member.save(function (err) {
      res.redirect('/admin/team');
    })
  },

  'admin-courses': function(req, res){
    res.render('admin-courses', { title: 'Current courses' })
  },

  'admin-venues': function(req, res){
    res.render('admin-venues', { title: 'Current venues' })
  },



});
