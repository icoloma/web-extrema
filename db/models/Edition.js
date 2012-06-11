var ObjectId = mongoose.Schema.ObjectId;

var EditionSchema = new mongoose.Schema({
     date: Date
  ,  course: {type: ObjectId, ref: 'Courses', required: true}
  ,  venue: {type: ObjectId, ref: 'Venues'}
  ,  instructor: {type: ObjectId, ref: 'Members'}
},
//Strict true para deshacerse del origin
{strict: true});

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
//los documentos correspondientes
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
              id: (ed.course && ed.course._id.toString())
              },
            venue: {
              name: (ed.venue && ed.venue.name) || 'No one',
              id: (ed.venue && ed.venue._id.toString())
            },
            instructor: {
              name: (ed.instructor && ed.instructor.name) || 'Nobody',
              id: (ed.instructor && ed.instructor._id.toString())
            }
          };
        });
        callback(err, reformatted);
      });
  };
};

var Edition = exports.Edition = mongoose.model('Editions', EditionSchema);