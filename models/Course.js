var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
    name: String
  , description: [String]
  //Picture
});

exports.Course = mongoose.model('Courses', CourseSchema);