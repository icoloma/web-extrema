var mongoose = require('mongoose'),
   fs = require('fs'),
   async = require('async');

// var Course = require('./Course').Course,
//   Venue = require('./Venue').Venue,
//   Member = require('./Member').Member;

var EditionSchema = new mongoose.Schema({
  date: Date
  ,  course: mongoose.Schema.ObjectId
  ,  venue: mongoose.Schema.ObjectId
  ,  instructor: mongoose.Schema.ObjectId
});

//Diccionarios entre atributos de HTML y campos del Schema
EditionSchema.statics.fromHTML = function (req, callback) {
  async.parallel([
    function (callback) {
      Member.findById(req.instructor, callback);
    },
    function (callback) {
      Course.findById(req.course, callback)
    },
    function (callback) {
      Venue.findById(req.venue, callback)
    },
  ], function (err, results) {
    var formatted = {
      date: req.date,
      instructor: results[0]._id,
      course: results[1]._id,
      venue: results[2]._id,
    };
    callback(err, formatted);
  });
};

exports.Edition = mongoose.model('Editions', EditionSchema);