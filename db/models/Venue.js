var mongoose = require('mongoose'),
   fs = require('fs');

var Edition = require('./Edition').Edition;

var VenueSchema = new mongoose.Schema({
    name: String
  , address: String
  , img: {
    data: Buffer,
    contentType: String
  }
});

//Diccionarios entre atributos de HTML y campos del Schema
var parseHTML = function (body) {
  var formatted = {
    name: body.name,
    address: body.address
  };
  if(body.picture.size) {
    data = fs.readFileSync(body.picture.path)
    formatted.img = {
      contentType: body.picture.mime,
      data: data
    };
  };
  return formatted;
};
   
VenueSchema.statics.saveFromHTML = function(body, callback) {
  var formatted = parseHTML(body),
    _new = new Venue(formatted);
  _new.save(callback);
};

VenueSchema.statics.updateFromHTML = function(id, body, callback) {
  var formatted = parseHTML(body);
  Venue.update( {_id: id}, formatted, callback);
};

VenueSchema.methods.getEditions = function (callback) {
  Edition.find({venue: this._id}, callback);
};

VenueSchema.methods.toHTML = function(callback) {
  var formatted = {
    name: this.name,
    address: this.address,
    picture: this.img,
    _id: this._id,
  };
  this.getEditions(function (err, eds) {
    formatted.editions = eds;
    callback(null, formatted);
  });
};

var Venue = mongoose.model('Venues', VenueSchema);

exports.Venue = Venue;