var Editions = require('./Editions').Editions,
  locales = require('./locales');

/*
Modelo de un miembro de Extrema
Campos:
  Nombre (req)
  E-mail
  Enlaces de redes sociales
  Descripción
  Tipo de miembro (IT/management)
  Imagen
  Etiquetas (con un formato 'nombre:color')
  
El campo 'deleted' se usa en el borrado lógico.
*/
var MemberSchema = new mongoose.Schema({
     name: {type: String, required: true}
   , email: String
   , tags: [String]
   , description: locales
   , thumb : {
      data: Buffer,
      contentType: String
   }
   //Enlaces a redes sociales
   , twitter: String
   , linkedin: String
   , blog: String
   , deleted: {type: Boolean, default: false}
});

/*
Métodos
*/
_.extend(MemberSchema.statics, require('../utils').statics);
_.extend(MemberSchema.methods, require('../utils').methods);

MemberSchema.statics.getItem = function (id, callback) {
  //Se especifica el campo correspondiente en las Editions
  this.getItemWithEditions(id, 'instructor', callback)
};

var Members = mongoose.model('Members', MemberSchema);

exports.Members = Members;