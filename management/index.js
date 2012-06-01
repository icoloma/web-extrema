var db = require('../db').db;

var Management = {

  addMember : function(params) {
    console.log('Registering new member');
    db.addMember(params);
  },
  
  listMembers: function(callback) {
    db.listMembers(callback);
  }

}



exports.addMember = Management.addMember;
exports.listMembers = Management.listMembers;

