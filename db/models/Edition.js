var mongoose = require('mongoose'),
   fs = require('fs');

var EditionSchema = new mongoose.Schema({
  date: Date
  //   course: [CourseSchema]
  // , venue: [VenueSchema]
  // , instructor: [MemberSchema]
})


exports.Edition = mongoose.model('Editions', EditionSchema);