var mongoose = require('mongoose'),
   fs = require('fs');

var VenueSchema = new mongoose.Schema({
    name: String
  , address: String
  , img: {
    data: Buffer,
    contentType: String
  }
  ,  editions: [mongoose.Schema.ObjectId]
});

//Diccionarios entre atributos de HTML y campos del Schema
VenueSchema.statics.fromHTML = function(req) {
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
   return formatted;
};

VenueSchema.statics.toHTML = function(sch) {
   var formatted = {
      name: sch.name,
      address: sch.address,
      picture: sch.img,
      _id: sch._id,
      editions: sch.editions
   };
   return formatted;
};


exports.Venue = mongoose.model('Venues', VenueSchema);