var mongoose = require('mongoose'),
   fs = require('fs');

var Edition = require('./Edition').Edition;

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
});

//Diccionarios entre atributos de HTML y campos del Schema
var parseHTML = function (body) {
  var formatted = {
    name: body.name,
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

CourseSchema.statics.saveFromHTML = function(body, callback) {
  var formatted = parseHTML(body),
    _new = new Course(formatted);
  _new.save(callback);
};

CourseSchema.statics.updateFromHTML = function(id, body, callback) {
  var formatted = parseHTML(body);
  Course.update( {_id: id}, formatted, callback);
};

CourseSchema.methods.getEditions = function (callback) {
  Edition.find({course: this._id}, callback);
};

CourseSchema.methods.toHTML = function(callback) {
   var formatted = {
      name: this.name,
      email: this.email,
      description_en: this.description.en,
      description_es: this.description.es,
      picture: this.img,
      _id: this._id,
   };
   this.getEditions(function (err, eds) {
    formatted.editions = eds;
    callback(null, formatted);
   });
};

var Course = mongoose.model('Courses', CourseSchema);

exports.Course = Course;