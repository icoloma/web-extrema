var mongoose = require('mongoose');

var EditionSchema = new mongoose.Schema({
  date: Date
  //   course: [CourseSchema]
  // , venue: [VenueSchema]
  // , instructor: [MemberSchema]
})


exports.Edition = mongoose.model('Editions', EditionSchema);