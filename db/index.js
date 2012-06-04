
// Development database
var _database = require('mongoskin').db('localhost:27017/extrema');

//Collections
var peopleCollection = 'team',
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
    console.log(_database.collection(peopleCollection).find(name).args);
    return _database
            .collection(peopleCollection)
            .find(name)
            .args;
  },

  addMember: function(params) {
    _database
      .collection(peopleCollection)
      .insert({
        name: params.name,
        email: params.email,
        social: {
          twitter: params['social-twitter'],
          linkedin: params['social-linkedin'],
          blog: params['social-blog']          
        },
        description: {
          es: params['description-es'],
          en: params['description-en']
        }
      });
  }
};


exports.db = DB;
