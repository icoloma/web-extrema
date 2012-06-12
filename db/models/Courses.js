var Editions = require('./Editions').Editions;

/*
Modelo de un curso
Campos:
  Nombre
  Descripción
  Imagen
*/
var CourseSchema = new mongoose.Schema({
    name: {type: String, required: true}
  , description: {
    en: String,
    es: String
  }
  , thumb : {
      data: Buffer,
      contentType: String
   }
});

//Diccionarios entre atributos de HTML y campos del Schema
var setVirtual = function(virtual, real) {
  CourseSchema
    .virtual(virtual)
    .get(function () {
      return this[real];
    })
    .set(function (item) {
      this.set(real, item);
    })
};

setVirtual('description_en', 'description.en');
setVirtual('description_es', 'description.en');

//Métodos
_.extend(CourseSchema.statics, require('../utils').statics);
_.extend(CourseSchema.methods, require('../utils').methods);

CourseSchema.statics.getItem = CourseSchema.statics.getItemWithEditions;

//Sobrescribe el delete por defecto.
//Al borrar un curso se borran todas sus Editions asociadas.
CourseSchema.statics.deleteItem = function(id, callback) {
  this.remove({_id: id}, function (err) {
    Editions.remove({course: id}, callback);
  });
};

var Courses = mongoose.model('Courses', CourseSchema);

exports.Courses = Courses;