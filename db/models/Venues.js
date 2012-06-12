var Editions = require('./Editions').Editions;

/*
Modelo de un local para un curso
Campos:
  Nombre
  Dirección
  Imagen
*/
var VenueSchema = new mongoose.Schema({
    name: {type: String, required: true}
  , address: String
  , thumb: {
    data: Buffer,
    contentType: String
  }
});

//Diccionarios entre atributos de HTML y campos del Schema
var setVirtual = function(virtual, real) {
  VenueSchema
    .virtual(virtual)
    .get(function () {
      return this[real];
    })
    .set(function (item) {
      this.set(real, item);
    })
};

//Métodos
_.extend(VenueSchema.statics, require('../utils').statics);
_.extend(VenueSchema.methods, require('../utils').methods);

VenueSchema.statics.getItem = function (id, callback) {
  VenueSchema.statics.getItemWithEditions.apply(this, arguments)
}

var Venues = mongoose.model('Venues', VenueSchema);

exports.Venues = Venues;