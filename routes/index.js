var _ = require('underscore'),
 mongoose = require('mongoose'),
 Member = require('../db/models').Member,
 fs = require('fs');


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

  adminTeam: {

    index: function(req, res){ 
      Member.find({},function(err, items) {
        res.render('admin-team', { 
          title: 'Current team members'
        , members: items
        })
      });
    },

    newMember: function(req, res){
      res.render('admin-team-new', { title: 'Add new member' })
    },

    addMember: function (req, res) {
      member = new Member();
      input = req.body;

      _.extend(member, {
        name: input.name,
        email: input.email,
        type: input.type,
        social: {
          twitter: input.twitter,
          blog: input.blog,
          linkedin: input.linkedin
        },
        description: {
          en: input.description,
          es: input.descripcion
        },
      });

      if(req.files.picture.size) {
        data = fs.readFileSync(req.files.picture.path)
        member.img = {
          contentType: req.files.picture.mime,
          data: data
        };
      };

      member.save(function (err) {
        res.redirect('/team');
      })
    },

    editMember: function(req, res) {
      Member.findOne({"name" : req.params.member}, function(err, person) {
        res.render('admin-team-member-edit', {
          title: req.params.member,
          member: person
        });
      })
    },

    updateMember: function(req, res) {
      member = {};
      //Guardar el nombre viejo, para buscar el documento
      name = req.params.member;
      input = req.body;

      _.extend(member, {
        name: input.name,
        email: input.email,
        type: input.type,
        social: {
          twitter: input.twitter,
          blog: input.blog,
          linkedin: input.linkedin
        },
        description: {
          en: input.description,
          es: input.descripcion
        }
      });

      if(req.files.picture.size) {
        data = fs.readFileSync(req.files.picture.path)
        member.img = {
          contentType: req.files.picture.mime,
          data: data
        };
      };

      Member.update({name: name}, member, function(err,num) {
        res.redirect('/team');
      });
    },

    deleteMember: function(req,res) {
      Member.remove({name : req.params.member}, function(err) {
        res.redirect('/team');
      });
    },

    picture: function(req,res) {
      Member.findOne({ name : req.params.member} , function(err, person) {
        // console.log(person);
        if (err) return next(err);
        if(person.img.data) {
           console.log(person.img.content);
           res.contentType(person.img.contentType);
           res.send(person.img.data);
        }
        else {
           res.sendfile('/public/images/person.png');
        }
      });
    },
  },

  'admin-courses': function(req, res){
    res.render('admin-courses', { title: 'Current courses' })
  },

  'admin-venues': function(req, res){
    res.render('admin-venues', { title: 'Current venues' })
  },

});
