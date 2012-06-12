var Editions = require('./Edition').Editions;

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

VenueSchema.methods.getEditions = function(callback) {
  var self = this;
  Editions.find({venue: this._id}, function (err, eds) {
    Editions.formatEditions(eds, function (err, formatted) {
      self.editions = formatted;
      callback(null, self);
    });
  });
};

var Venues = mongoose.model('Venues', VenueSchema);

exports.Venues = Venues;