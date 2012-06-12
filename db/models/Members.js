var Editions = require('./Editions').Editions;

/*
Modelo de un miembro de Extrem
Campos:
  Nombre
  E-mail
  Enlaces de redes sociales
  Descripción
  Tipo de miembro (IT/management)
  Imagen
*/
var MemberSchema = new mongoose.Schema({
     name: {type: String, required: true}
   , email: String
   , type: String
   , description: {
      es: String,
      en: String
     }
   , thumb : {
      data: Buffer,
      contentType: String
   }
   //Enlaces a redes sociales
   , twitter: String
   , linkedin: String
   , blog: String
});

//Diccionarios entre atributos de HTML y campos del Schema

var setVirtual = function(virtual, real) {
  MemberSchema
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

//IDEA: podrían añadirse las Editions como un virtual,
//pero no funciona: al buscar el campo 'editions' se 
//llama de forma asíncrona
//Quizá con un plugin para Promises: express-mongoose
// MemberSchema
//   .virtual('editions')
//   .get(function() {
//     Editions.find({instructor: this._id}, function (err, eds) {
//       Editions.formatEditions(eds, function (err, formatted_eds) {
//         return formatted_eds;
//       });
//     });
//   });

//Métodos
_.extend(MemberSchema.statics, require('../utils').statics);
_.extend(MemberSchema.methods, require('../utils').methods);

MemberSchema.statics.getItem = MemberSchema.statics.getItemWithEditions;

var Members = mongoose.model('Members', MemberSchema);

exports.Members = Members;