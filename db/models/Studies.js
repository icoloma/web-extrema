var locales = require('./locales');

/*
Modelo de un caso de éxito
Campos:
  Nombre del cliente
  Descripción
  Imagen

El campo 'deleted' se usa en el borrado lógico.
*/
var StudySchema = new mongoose.Schema({
    name: String
  , description: locales
  , thumb : {
      data: Buffer,
      contentType: String
   }
  , deleted: {type: Boolean, default: false}
});

/*
Métodos
*/
_.extend(StudySchema.statics, require('../utils').statics);
_.extend(StudySchema.methods, require('../utils').methods);

StudySchema.statics.getItem = function (id, callback) {
  this.findById(id, callback);
};

var Studies = mongoose.model('Studies', StudySchema);

exports.Studies = Studies;