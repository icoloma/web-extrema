var ObjectId = mongoose.Schema.ObjectId;

var EditionSchema = new mongoose.Schema({
     date: Date
  ,  course: {type: ObjectId, ref: 'Courses'}
  ,  venue: {type: ObjectId, ref: 'Venues'}
  ,  instructor: {type: ObjectId, ref: 'Members'}
});

//Diccionarios entre atributos de HTML y campos del Schema
var setVirtual = function(virtual, real) {
  EditionsSchema
    .virtual(virtual)
    .get(function () {
      return this[real];
    })
    .set(function (item) {
      this.set(real, item);
    })
};

//Utiliza 'populate' para devolver las Editions con 
EditionSchema.statics.formatEditions = function (eds, callback) {
  if(!eds || eds.length === 0) {
    callback(null, [])
  } else {
    if(!_.isArray(eds))
      eds = [eds];
    Edition
      .find()
      .or(eds) //Busca mediante el array de IDs
      .populate('instructor', ['name'])
      .populate('course', ['name'])
      .populate('venue', ['name'])
      .run(function (err, formatted) {
        reformatted = formatted.map(function (ed) {
          return {
            id: ed._id,
            date: ed.date || 'None',
            course: {
              name: (ed.course && ed.course.name) || 'Something bad happened',
              },
            venue: {
              name: (ed.venue && ed.venue.name) || 'No one',
            },
            instructor: {
              name: (ed.instructor && ed.instructor.name) || 'Nobody',
            }
          };
        });
        callback(err, reformatted);
      });
  };
};

var Edition = exports.Edition = mongoose.model('Editions', EditionSchema);