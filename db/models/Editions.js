var ObjectId = mongoose.Schema.ObjectId;


/*
Modelo de una convocatoria de un curso:
Campos:
  Fecha
  Curso
  Local
  Instructor
*/

var EditionSchema = new mongoose.Schema({
     date: Date
  ,  course: {type: ObjectId, ref: 'Courses', required: true}
  ,  venue: {type: ObjectId, ref: 'Venues'}
  ,  instructor: {type: ObjectId, ref: 'Members'}
},
//Strict true para deshacerse del origin
{strict: true});

//Métodos
_.extend(EditionSchema.statics, require('../utils').statics);
_.extend(EditionSchema.methods, require('../utils').methods);

//El get por defecto no está pensado para una edición
EditionSchema.statics.getItem = function (id, callback) {
  this.findById(id, function (err, item) {
    Editions.formatEditions(item, function (err, formatted) {
      callback(err, formatted[0]);
    }); 
  });
};

//El delete por defecto busca las ediciones correspondiente
//No procede para una edición.
EditionSchema.statics.deleteItem = function (id, callback) {
  this.remove({_id: id}, callback);
};

//Utiliza 'populate' para devolver las Editions con
//los documentos correspondientes.
EditionSchema.statics.formatEditions = function (eds, callback) {
  if(!eds || eds.length === 0) {
    callback(null, [])
  } else {
    if(!_.isArray(eds))
      eds = [eds];
    Editions
      .find()
      .or(eds) //Busca mediante el array de IDs
      .populate('instructor', ['name'])
      .populate('course', ['name'])
      .populate('venue', ['name'])
      .run(function (err, formatted) {
        reformatted = formatted.map(function (ed) {
          return {
            id: ed._id,
            date: (ed.date && ed.date.toLocaleDateString()) || 'None',
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

var Editions = exports.Editions = mongoose.model('Editions', EditionSchema);