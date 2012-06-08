var _ = require('underscore'), 
  key = require('../routes/key'),
  async = require('async')
  Model = require('mongoose').Model;


module.exports = {};

//Lista de modelos a para exportar
['Course',
  'Member',
  'Venue',
  'Edition',
  ].forEach(function(name) {
    _.extend(module.exports, require('./models/' + name + '.js'));
  });

//Obtiene el modelo correspondiente a partir de la url
var getModel = function(field) {
    return module.exports[key.fields[field]];
};

var getEditions = function(field, model) {
  Edition.find({})
};

var formatEditions = function (eds, callback) {
  if(!eds || eds.length === 0) {
    callback(null, [])
  } else {
    async.map(eds, function (ed, c_b) {
      async.parallel([
        function (cb) {
          Member.findById(ed.instructor._id, cb(err, item))
      },
        function (cb) {
          Course.findById(ed.course._id, cb(err, item))
      },
        function (cb) {
          Venue.findById(ed.venue._id, cb(err, item))
      },
      ], function (err, results) {
        formatted = {
          id: ed._id.toString(),
          instructor: {
            name: results[0].name,
            id: results[0]._id.toString()
          },
          course: {
            name: results[1].name,
            id: results[1]._id.toString()
          },
          venue: {
            name: results[2].name,
            id: results[2]._id.toString()
          },
        };
        c_b(err, formatted);
      });

    }, function (err, results) {
      callback(err, results);
    });
  };

  // eds.map(function (id_ed) {
  //   return {_id: id_ed};
  // });
  
  // module.exports.Edition.find({})
  //   .or(eds)
  //   .exec(function (err, items) {
  //     if(err === '$or requires nonempty array') {
  //       items = [];
  //     } else {
  //       items.map(function (item)  {
  //         return item.schema.toHTML(item)
  //       });
  //     };
  //     eds = items;
  //     callback.apply(this, [eds]);
  //   });
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
    async.waterfall([
      function (cb) {
        model.find({}, function (err, items) {
          cb(err, items);
        });
      },
      function (items, cb) {
        async.map(items, function (item, c_b) {
          model.toHTML(item, c_b);
        },
        function (err, results) {
          cb(err, results);
        });
      },
      ], function (err, formatted) {
          callback(err, formatted);
      });

    // model.find({}, function(err, items) {
    //   var formatted = items.map(function(item) {
    //     return model.toHTML(item);
    //   });
    //   callback.apply(this, [err, formatted]);
    // });
  },

  getItem: function(field, id, callback) {
    var model = getModel(field);
    async.waterfall([
      function (cb) {
        model.findById(id, cb);
      },
      function (item, cb) {
        model.toHTML(item, cb);
      },
      function (formatted, cb) {
        formatEditions(formatted.editions, function (err, reformatted) {
          formatted.editions = reformatted;
          cb(err, formatted);
        });
      },
      ], function (err, reformatted) {
          callback(err, reformatted);
      });

    // model.findById(id, function(err, item) {
    //   var formatted = model.toHTML(item);
    //   formatEditions(formatted.editions, function(eds) {
    //     formatted.editions = eds;
    //     callback.apply(this,[err, formatted]);
    //   });
    // });
  },

  updateItem: function(field, id, body, callback) {
    var model = getModel(field);
    model.fromHTML(body, function (err, updated) {
      model.update({ _id: id }, updated, callback);
    });
  },

  addItem: function(field, body, callback) {
    var model = getModel(field);
    async.series([
      function (callback) {
        model.fromHTML(body, callback);
      }], function (err, results) {
        instance = new model();
        _.extend(instance, results[0]);
        instance.save(callback);
      }
    );
  },

  deleteItem: function(field, id, callback) {
    var model = getModel(field);
    model.remove( {_id: id }, callback);
  },

});

