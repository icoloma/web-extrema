var Editions = require('./Editions').Editions;

var MemberSchema = new mongoose.Schema({
     name: {type: String, required: true}
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
   , thumb : {
      data: Buffer,
      contentType: String
   }
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
setVirtual('twitter', 'social.twitter');
setVirtual('blog', 'social.blog');
setVirtual('linkedin', 'social.linkedin');

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

MemberSchema.methods.getEditions = function (callback) {
   var self = this;
   Editions.find({instructor: this._id}, function (err, eds) {
    Editions.formatEditions(eds, function (err, formatted) {
      self.editions = formatted;
      callback(null, self);
    });
   });
};

var Members = mongoose.model('Members', MemberSchema);

exports.Members = Members;