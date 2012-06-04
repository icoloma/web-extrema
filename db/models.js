
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//Collections
var teamCollection = 'team',
  coursesCollection = 'courses',
  editionsCollection = 'editions',
  venuesCollection = 'venues';


var MemberSchema = new Schema({
   name: String
 , email: String
 , social: [String]
 , type: String
 , description: [String]
 //Picture
} , {collection: teamCollection});

var CourseSchema = new Schema({
    name: String
  , description: [String]
  //Picture
});

var VenueSchema = new Schema({
  address: String
});


var EditionSchema = new Schema({
    course: [CourseSchema]
  , venue: [VenueSchema]
  , instructor: [MemberSchema]
  , date: Date
}) 

exports.Member = mongoose.model('Members', MemberSchema);
exports.Course = mongoose.model('Courses', CourseSchema);
exports.Venue = mongoose.model('Venues', MemberSchema);
exports.Edition = mongoose.model('Editions', EditionSchema);
