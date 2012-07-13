var Editions = require('./Editions').Editions,
  locales = require('./locales');

/*
Modelo de un curso
Campos:
  Nombre
  Descripción
  Voucher
  Url del curso en la web
  Imagen
  Tipo (Spring, HTML5, Javaspecialists)
  Precio
  Duración (horas)
  Id del show en koliseo

El campo 'deleted' se usa en el borrado lógico.
*/
var CourseSchema = new mongoose.Schema({
    name: locales
  , description: locales
  , voucher: locales
  , url: String
  , thumb : {
      data: Buffer,
      contentType: String
   }
  , type: String
  , price: Number
  , duration: Number
  , show: String
  , deleted: {type: Boolean, default: false}
});

/*
Métodos
*/
_.extend(CourseSchema.statics, require('../utils').statics);
_.extend(CourseSchema.methods, require('../utils').methods);

CourseSchema.statics.getItem =function (id, callback) {
  //Se especifica el campo correspondiente en las Editions
  this.getItemWithEditions(id, 'course', callback)
};

//Sobrescribe el delete por defecto.
//Al borrar un curso se borran todas sus Editions asociadas.
CourseSchema.statics.deleteItem = function(id, callback) {
  this.update({_id: id}, {deleted: true}, function (err, num) {
    Editions.find({course: id}, function (err, items) {
      async.forEach(items,
        function (item, cb) {
          Editions.update({_id: item._id}, {deleted: true}, cb);
        }, 
        callback);
    });
  });
};

var Courses = mongoose.model('Courses', CourseSchema);

exports.Courses = Courses;