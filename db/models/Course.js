var Editions = require('./Edition').Editions;

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

CourseSchema.methods.getEditions = function(callback) {
   var self = this;
   Editions.find({course: this._id}, function (err, eds) {
    Editions.formatEditions(eds, function (err, formatted) {
      self.editions = formatted;
      callback(null, self);
    });
   });
};

var Courses = mongoose.model('Courses', CourseSchema);

exports.Courses = Courses;