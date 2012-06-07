var _ = require('underscore'), 
  key = require('../routes/key');


module.exports = {};

//Lista de modelos a para exportar
['Course',
  'Edition',
  'Member',
  'Venue'].forEach(function(name) {
    _.extend(module.exports, require('./models/' + name + '.js'));
  });

//Obtiene el modelo correspondiente a partir de la url
var getModel = function(field) {
    return module.exports[key.fields[field]];
};

//Métodos para gestionar la base de datos
_.extend(module.exports, {

  isModel: function(field) {
    if (key.fields[field])
      return true
    else
      return false
  },

  getItems: function (field, callback) {
    var model = getModel(field);
    model.find({}, callback);
  },

  getItem: function(field, id, callback) {
    var model = getModel(field);
    model.findById(id, function(err, item) {
      formatted = model.toHTML(item);
      callback.apply(this,[err, formatted]);
    });
  },

  updateItem: function(field, id, body, callback) {
    var model = getModel(field);
    updated = model.fromHTML(body);
    model.update({ _id: id }, updated, callback);
  },

  addItem: function(field, body, callback) {
    var model = getModel(field);
    _new = model.fromHTML(body),
      instance = new model();

    _.extend(instance, _new);
    instance.save(callback);
  },

  deleteItem: function(field, id, callback) {
    var model = getModel(field);
    model.remove( {_id: id }, callback);
  },

});

