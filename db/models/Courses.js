var Editions = require('./Editions').Editions;

/*
Modelo de un curso
Campos:
  Nombre (req)
  Descripción
  Imagen

El campo 'deleted' se usa en el borrado lógico.
*/
var CourseSchema = new mongoose.Schema({
    name: {type: String, required: true}
  , description_en: String
  , description_es: String
  , thumb : {
      data: Buffer,
      contentType: String
   }
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