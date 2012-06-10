var Edition = require('./Edition').Edition;

var CourseSchema = new mongoose.Schema({
    name: String
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
   Edition.find({course: this._id}, function (err, eds) {
    Edition.formatEditions(eds, function (err, formatted) {
      self.editions = formatted;
      callback(null, self);
    });
   });
};

var Course = mongoose.model('Courses', CourseSchema);

exports.Course = Course;