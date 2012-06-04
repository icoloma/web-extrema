var db = require('../db').db;
var _ = require('underscore');

var Management = {

  addMember : function(params) {
    console.log('Registering new member');
    db.addMember(params);
  },
  
  listMembers: function(callback) {
    db.listMembers(callback);
  }

}

var myModels = {
  Person: function(name, email, social, description, courseEditions) {
    this.name = name;
    this.email = email ? email: '';
    this.description = description ? description : {en: '', es: ''};
    this.social = social ? social: [];
    this.courseEditions = courseEditions ? courseEditions : [];
    this.picture = picture ? picture : 'images/person.png';
  },

  CourseEdition : function(course, date, venue) {
    this.course = name;
    this.date = date;
    this.venue = venue;
  },

  Venue : function(address, courseEditions) {
    this.address = address;
    this.courseEditions = course.Editions;
  },

  Course : function(name, description, editions) {
    this.name = name;
    this.description = description ? description : {en: '', es: ''};
    this.editions = editions;
  }
};

exports.Person = myModels.Person;
exports.CourseEdition = myModels.CourseEdition;
exports.Course = myModels.Course;
exports.Venue = myModels.Venue;

exports.addMember = Management.addMember;
exports.listMembers = Management.listMembers;

