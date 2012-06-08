var mongoose = require('mongoose'),
   fs = require('fs');

var EditionSchema = require('./Edition').Edition.schema;

var VenueSchema = new mongoose.Schema({
    name: String
  , address: String
  , img: {
    data: Buffer,
    contentType: String
  }
  ,  editions: [ EditionSchema ]
});

//Diccionarios entre atributos de HTML y campos del Schema
VenueSchema.statics.fromHTML = function(req, callback) {
   var formatted = {
      name: req.name,
      address: req.address
   };
    if(req.picture.size) {
      data = fs.readFileSync(req.picture.path)
      formatted.img = {
        contentType: req.picture.mime,
        data: data
      };
    };
   callback(null, formatted);
};

VenueSchema.statics.toHTML = function(sch, callback) {
   var formatted = {
      name: sch.name,
      address: sch.address,
      picture: sch.img,
      _id: sch._id,
      editions: sch.editions
   };
   callback(null, formatted);
};


exports.Venue = mongoose.model('Venues', VenueSchema);