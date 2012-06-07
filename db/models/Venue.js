var mongoose = require('mongoose');

var VenueSchema = new mongoose.Schema({
  address: String
});

exports.Venue = mongoose.model('Venues', VenueSchema);