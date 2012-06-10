var Edition = require('./Edition').Edition;

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
// MemberSchema
//   .virtual('editions')
//   .get(function() {
//     Edition.find({instructor: this._id}, function (err, eds) {
//       Edition.formatEditions(eds, function (err, formatted_eds) {
//         return formatted_eds;
//       });
//     });
//   });

MemberSchema.methods.getEditions = function (callback) {
   var self = this;
   Edition.find({instructor: this._id}, function (err, eds) {
    Edition.formatEditions(eds, function (err, formatted) {
      self.editions = formatted;
      callback(null, self);
    });
   });
};

var Member = mongoose.model('Members', MemberSchema);

exports.Member = Member;