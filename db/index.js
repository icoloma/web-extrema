var key = require('../routes/key');

var me = {};
module.exports =  me;

//Lista de modelos a para exportar
['Courses',
  'Members',
  'Venues',
  'Editions',
  ].forEach(function(name) {
    _.extend(me, require('./models/' + name + '.js'));
  });

//Obtiene el modelo correspondiente a partir de la url
var getModel = function(field) {
    return me[key.fields[field]];
};

/*
*Métodos para gestionar la base de datos
*/
_.extend(me, {

  isModel: function(field) {
    if (key.fields[field])
      return true
    else
      return false
  },

  getItems: function (field, callback) {
    var model = getModel(field);
    model.getItems(callback);    
  },

  getItem: function (field, id, callback) {
    var model = getModel(field);
    model.getItem(id, callback);    
  },

  updateItem: function(field, id, body, callback) {
    var model = getModel(field);
    model.updateItem(id, body, callback)
  },

  addItem: function(field, body, callback) {
    var model = getModel(field);
    model.addItem(body, callback)
  },

  deleteItem: function(field, id, callback) {
    var model = getModel(field);    
    model.deleteItem(id, callback);
  },

  //Obtiene todos los items para seleccionar a la 
  //hora de gestionar una Edition
  getAllItems: function(callback) {
    async.parallel([function (cb) {
      me.Members.find({}, cb);
    }, function (cb) {
        me.Courses.find({}, cb);
    }, function (cb) {
        me.Venues.find({}, cb);
    }], function (err, results) {
      callback({
        members: results[0],
        courses: results[1],
        venues: results[2]
      })
    });
  },

  getThumbnail: function(field, id, callback) {
    var model = getModel(field);
    model.getThumbnail(id, callback);
  },

});