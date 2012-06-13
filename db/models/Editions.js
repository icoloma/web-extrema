var ObjectId = mongoose.Schema.ObjectId;


/*
Modelo de una convocatoria de un curso:
Campos:
  Fecha
  Curso (req)
  Local
  Instructor
El parámetro 'ref' permite hacer usar el método populate para
encontrar los documentos correspondientes.
El campo 'deleted' se usa en el borrado lógico.
*/

var EditionSchema = new mongoose.Schema({
     date: Date
  ,  course: {type: ObjectId, ref: 'Courses'}
  ,  venue: {type: ObjectId, ref: 'Venues'}
  ,  instructor: {type: ObjectId, ref: 'Members'}
  ,  deleted: {type: Boolean, default: false}
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

//Utiliza 'populate' para devolver las Editions con
//los documentos correspondientes.
EditionSchema.statics.formatEditions = function (eds, callback) {
  
  //Comprueba que el documento correspondiente no se encuentre borrado
  var checkProp = function (obj, prop, defaultMsg) {
    return (!obj.deleted && obj[prop]) || defaultMsg;
  };

  if(!eds || eds.length === 0) {
    callback(null, [])
  } else {
    if(!_.isArray(eds))
      eds = [eds];
    Editions
      .find()
      .or(eds) //Busca mediante el array de IDs
      .populate('instructor', ['name', 'deleted'])
      .populate('course', ['name', 'deleted'])
      .populate('venue', ['name', 'deleted'])
      .run(function (err, formatted) {
        var reformatted = formatted.map(function (ed) {
          return {
            id: ed._id,
            date: (ed.date && ed.date.toLocaleDateString()) || 'None',
            course: {
              name: checkProp(ed.course, 'name', 'Something bad happened'),
              id:  checkProp(ed.course, '_id') //.toString()
            },
            venue: {
              name: checkProp(ed.venue, 'name', 'No one'),
              id:  checkProp(ed.venue, '_id')
            },
            instructor: {
              name: checkProp(ed.instructor, 'name', 'No one'), 
              id:  checkProp(ed.instructor, '_id')
            }
          };
        });
        callback(err, reformatted);
      });
  };
};

var Editions = exports.Editions = mongoose.model('Editions', EditionSchema);