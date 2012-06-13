var Courses = require('./models/Courses').Courses,
  Members = require('./models/Members').Members,
  Venues = require('./models/Venues'). Venues,
  Editions = require('./models/Editions').Editions;

//Utilidades genéricas de la base de datos
module.exports =  {};

_.extend(
  module.exports, { 
    getAllItems: function(callback) {
      async.parallel([function (cb) {
        Members.find({deleted: false}, cb);
      }, function (cb) {
          Courses.find({deleted: false}, cb);
      }, function (cb) {
          Venues.find({deleted: false}, cb);
      }], function (err, results) {
        callback({
          members: results[0],
          courses: results[1],
          venues: results[2]
        })
      });
    },
  }
);