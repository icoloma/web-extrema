var mongoose = require('mongoose'),
   fs = require('fs');

var CourseSchema = new mongoose.Schema({
    name: String
  , description: {
    en: String,
    es: String
  }
  , img : {
      data: Buffer,
      contentType: String
   }
   , editions: [ mongoose.Schema.ObjectId ]
});

//Diccionarios entre atributos de HTML y campos del Schema
CourseSchema.statics.fromHTML = function(req) {
   var formatted = {
      name: req.name,
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

CourseSchema.statics.toHTML = function(sch) {
   var formatted = {
      name: sch.name,
      email: sch.email,
      description_en: sch.description.en,
      description_es: sch.description.es,
      picture: sch.img,
      _id: sch._id,
      editions: sch.editions,
   };
   return formatted;
};

exports.Course = mongoose.model('Courses', CourseSchema);