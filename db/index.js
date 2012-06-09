var key = require('../routes/key');


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

var formatEditions = function (eds, callback) {
  if(!eds || eds.length === 0) {
    callback(null, [])
  } else {
    module.exports.Edition
      .find()
      .or(eds)
      .populate('instructor', ['name', '_id'])
      .populate('course', ['name', '_id'])
      .populate('venue', ['name', '_id'])
      .run(function (err, formatted) {
        reformatted = formatted.map(function (ed) {
          return {
            date: ed.date || 'None',
            course: {
              name: (ed.course && ed.course.name) || 'No one',
              // id: ed.course._id.toString()},
              },
            venue: {
              name: (ed.venue && ed.venue.name) || 'No one',
              // id: ed.venue._id.toString()},
            },
            instructor: {
              name: (ed.instructor && ed.instructor.name) || 'Nobody',
              // id: ed.instructor._id.toString()},
            }
          };
        });
        callback(err, reformatted);
      });
  };
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
    model.find({}, function (err, items) {
      async.map(items, function (item, callback) {
        item.toHTML(callback)
      }, callback);
    });
  },

  getItem: function (field, id, callback) {
    var model = getModel(field);
    model.findById(id, function (err, item) {
      item.toHTML(function (err, formatted) {
        if(model.modelName === 'Editions') {
          callback(err, formatted);
        } else {
          formatEditions(formatted.editions, function (err, reformatted) {
            formatted.editions = reformatted;
            callback(err, formatted);
          });
        };
      });
    });
  },

  updateItem: function(field, id, body, callback) {
    var model = getModel(field);
    model.updateFromHTML(id, body, callback);
  },

  addItem: function(field, body, callback) {
    var model = getModel(field);
    model.saveFromHTML(body, callback);
  },

  deleteItem: function(field, id, callback) {
    var model = getModel(field),
      Edition = module.exports.Edition;
    if(model.modelName === 'Editions') {
      Edition.remove( {_id: id}, callback);
    } else {
      model.remove({_id: id}, function (err) {
        for(pathName in Edition.schema.paths) {
          var path = Edition.schema.paths[pathName];
          if(path.options && path.options.ref && path.options.ref === model.modelName)
            var modelPath = pathName;
        }
        search = {};
        search[modelPath] = id;
        Edition.find(search, function (err, items) {
          async.forEach(items, function (item, cb) {
            var _new = {};
            for(pathName in Edition.schema.paths) {
              if(pathName !== "_id" && pathName !== modelPath && item[pathName]) {
                var prop = {};
                prop[pathName] = item[pathName];
                _.extend(_new, prop)
              };
            };
            Edition.remove( {_id: item._id}, function (err) {
              _New = new Edition(_new);
              _New.save(cb);
            });
          }, callback);
        });

        //No parece que funcione mediante $unset
        //
        // var search = {};
        // search[modelPath] = id;
        // var updating = 1,
        //   updated = {};
        // updated[modelPath] = updating;
        // Edition
        //   .collection
        //   .update(search, {$unset: updated }, callback);
      });
    }
  },
});

