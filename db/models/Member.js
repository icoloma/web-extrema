var mongoose = require('mongoose'),
   fs = require('fs');

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
   , editions: [ mongoose.Schema.ObjectId ]
});

//Diccionarios entre atributos de HTML y campos del Schema
MemberSchema.statics.fromHTML = function(req) {
   var formatted = {
      name: req.name,
      email: req.email,
      type: req.type,
      social: {
         twitter: req.twitter,
         linkedin: req.linkedin,
         blog: req.blog
      },
      description: {
         en: req.description_en,
         es: req.description_es
      }
   };
  if(req.picture.size) {
    data = fs.readFileSync(req.picture.path)
      formatted.img = {
        contentType: req.picture.mime,
        data: data
      };
    };
  return formatted;
};

MemberSchema.statics.toHTML = function(sch) {
   var formatted = {
      name: sch.name,
      email: sch.email,
      type: sch.type,
      twitter: sch.social.twitter,
      blog: sch.social.blog,
      linkedin: sch.social.linkedin,
      description_en: sch.description.en,
      description_es: sch.description.es,
      picture: sch.img,    
      _id: sch._id,
      editions: sch.editions
   };
   return formatted;
};

exports.Member = mongoose.model('Members', MemberSchema);
