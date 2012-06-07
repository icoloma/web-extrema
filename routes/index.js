var _ = require('underscore'),
 mongoose = require('mongoose'),
 db = require('../db'),
 // models.Member = require('../db/models').Member,
 fs = require('fs');

// foo = mongoose.model('');

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
      models.Member.find({},function(err, items) {
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
      member = new models.Member();
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
      models.Member.findOne({ "name" : req.params.member }, function(err, person) {
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

      models.Member.update({ name: name }, member, function(err,num) {
        res.redirect('/team');
      });
    },

    deleteMember: function(req,res) {
      models.Member.remove({ name : req.params.member }, function(err) {
        res.redirect('/team');
      });
    },

    picture: function(req,res) {
      models.Member.findOne({ name : req.params.member } , function(err, person) {
        if(person.img.data) {
           res.contentType(person.img.contentType);
           res.send(person.img.data);
        }
        else {
           res.redirect('/images/person.png');
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
