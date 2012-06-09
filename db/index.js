var key = require('../routes/key');

var me = {};
module.exports =  me;

//Lista de modelos a para exportar
['Course',
  'Member',
  'Venue',
  'Edition',
  ].forEach(function(name) {
    _.extend(me, require('./models/' + name + '.js'));
  });

//Obtiene el modelo correspondiente a partir de la url
var getModel = function(field) {
    return me[key.fields[field]];
};

//Formatea las ediciones mediante 'populate'
var formatEditions = function (eds, callback) {
  if(!eds || eds.length === 0) {
    callback(null, [])
  } else {
    me.Edition
      .find()
      .or(eds) //Busca mediante el array de IDs
      .populate('instructor', ['name'])
      .populate('course', ['name'])
      .populate('venue', ['name'])
      .run(function (err, formatted) {
        reformatted = formatted.map(function (ed) {
          return {
            id: ed._id,
            date: ed.date || 'None',
            course: {
              name: (ed.course && ed.course.name) || 'No one',
              },
            venue: {
              name: (ed.venue && ed.venue.name) || 'No one',
            },
            instructor: {
              name: (ed.instructor && ed.instructor.name) || 'Nobody',
            }
          };
        });
        callback(err, reformatted);
      });
  };
};

//Métodos para gestionar la base de datos
_.extend(me, {

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
          
          //Si no es una Edition, 
          //formatear las Editions correspondientes antes
          
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
      Edition = me.Edition;
    if(model.modelName === 'Editions') {
      Edition.remove( {_id: id}, callback);
    } else {
      
      //Si no es una Edition, se borra el documento
      //en las editions que lo contengan
      
      model.remove({_id: id}, function (err) {

        //Selecciona el campo adecuado para filtrar las Editions
        for(pathName in Edition.schema.paths) {
          var path = Edition.schema.paths[pathName];
          if(path.options && path.options.ref && path.options.ref === model.modelName)
            var modelPath = pathName;
        }
        search = {};
        search[modelPath] = id;

        Edition.find(search, function (err, items) {
          async.forEach(items, function (item, cb) {

            //WORKAROUND: de momento, se crea una Edition idéntica salvo por el
            //campo borrado, y se borra la anterior

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
    };
  },

  //Obtiene todos los items para seleccionar a la 
  //hora de gestionar una Edition
  getAllItems: function(callback) {
    async.parallel([function (cb) {
      me.Member.find({}, cb);
    }, function (cb) {
        me.Course.find({}, cb);
    }, function (cb) {
        me.Venue.find({}, cb);
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
    model.findById(id, function (err, item) {
      var thumb = false;
      if(item.thumb && item.thumb.data) {
        thumb = {
          data: item.thumb.data,
          contentType: item.thumb.contentType
        };
      };
      callback(err, thumb);
    })
  }

});