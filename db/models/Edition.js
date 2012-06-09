var ObjectId = mongoose.Schema.ObjectId;

var EditionSchema = new mongoose.Schema({
  date: Date
  ,  course: {type: ObjectId, ref: 'Courses'}
  ,  venue: {type: ObjectId, ref: 'Venues'}
  ,  instructor: {type: ObjectId, ref: 'Members'}
});

//Diccionarios entre atributos de HTML y campos del Schema
var parseHTML = function (body) {
  var formatted = {
    date: body.date,
    course: body.course,
    venue: body.venue,
    instructor: body.instructor
  };
  return formatted;
};

EditionSchema.statics.saveFromHTML = function (body, callback) {
  var formatted = parseHTML(body),
    _new = new Edition(formatted);
  _new.save(callback);
};

EditionSchema.statics.updateFromHTML = function(id, body, callback) {
  var formatted = parseHTML(body);
  Edition.update( {_id: id}, formatted, callback);
};

var Edition = exports.Edition = mongoose.model('Editions', EditionSchema);