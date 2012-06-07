var mongoose = require('mongoose'),
   fs = require('fs');

var CourseSchema = require('./Course').Course.schema,
  VenueSchema = require('./Venue').Venue.schema,
  MemberSchema = require('./Member').Member.schema;

var EditionSchema = new mongoose.Schema({
  date: Date
  ,  course: [CourseSchema]
  ,  venue: [VenueSchema]
  ,  instructor: [MemberSchema]
});


exports.Edition = mongoose.model('Editions', EditionSchema);