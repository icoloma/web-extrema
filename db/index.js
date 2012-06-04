
// Development database
var _database = require('mongoskin').db('localhost:27017/extrema');

//Collections
var peopleCollection = 'persons',
  coursesCollection = 'courses',
  editionsCollection = 'editions',
  venuesCollection = 'venues';

var DB = {
  
  listMembers: function(callback) {
    _database
      .collection(peopleCollection)
      .find()
      .toArray(callback)
  },

  getMember: function(name, callback) {
    return _database
            .collection(peopleCollection)
            .find(name);
  },

  addMember: function(params) {
    _database
      .collection(peopleCollection)
      .insert({
        name: params.name,
        email: params.email
      });
  }
};


exports.db = DB;
