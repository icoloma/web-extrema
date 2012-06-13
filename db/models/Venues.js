var Editions = require('./Editions').Editions;

/*
Modelo de un local para un curso
Campos:
  Nombre (req)
  Dirección
  Imagen

El campo 'deleted' se usa en el borrado lógico.
*/
var VenueSchema = new mongoose.Schema({
    name: {type: String, required: true}
  , address: String
  , thumb: {
    data: Buffer,
    contentType: String
  }
  , deleted: {type: Boolean, default: false}
});

/*
Métodos
*/
_.extend(VenueSchema.statics, require('../utils').statics);
_.extend(VenueSchema.methods, require('../utils').methods);

VenueSchema.statics.getItem = function (id, callback) {
  //Se especifica el campo correspondiente en las Editions
  this.getItemWithEditions(id, 'venue', callback)
};

var Venues = mongoose.model('Venues', VenueSchema);

exports.Venues = Venues;