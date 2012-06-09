var mongoose = require('mongoose'),
   fs = require('fs'),
   async = require('async');

var Edition = require('./Edition').Edition;

var MemberSchema = new mongoose.Schema({
     name: String
   , email: String
   , social: {
      twitter: String,
      linkedin: String,
      blog: String
     }
   , type: String
   , description: {
      es: String,
      en: String
     }
   , img : {
      data: Buffer,
      contentType: String
   }
});

//Diccionarios entre atributos de HTML y campos del Schema

var parseHTML = function (body) {
  var formatted = {
    name: body.name,
    email: body.email,
    type: body.type,
    social: {
      twitter: body.twitter,
      linkedin: body.linkedin,
      blog: body.blog
    },
    description: {
      en: body.description_en,
      es: body.description_es
    }
  };
  if(body.picture.size) {
   data = fs.readFileSync(body.picture.path)
    formatted.img = {
      contentType: body.picture.mime,
      data: data
    };
   };
   return formatted;
};

MemberSchema.statics.saveFromHTML = function(body, callback) {
  var formatted = parseHTML(body),
    _new = new Member(formatted);
  _new.save(callback);
};

MemberSchema.statics.updateFromHTML = function(id, body, callback) {
  var formatted = parseHTML(body);
  Member.update( {_id: id}, formatted, callback);
};

MemberSchema.methods.toHTML = function (callback) {
   var formatted = {
      name: this.name,
      email: this.email,
      type: this.type,
      twitter: this.social.twitter,
      blog: this.social.blog,
      linkedin: this.social.linkedin,
      description_en: this.description.en,
      description_es: this.description.es,
      picture: this.img,    
      _id: this._id,
   };
   return this.getEditions(function (err, eds) {
    formatted.editions = eds;
    callback(null, formatted);
   });
};

MemberSchema.methods.getEditions = function (callback) {
  Edition.find({instructor: this._id}, callback);
};

var Member = mongoose.model('Members', MemberSchema);

exports.Member = Member;