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

//Comprueba que se ha elegido un thumbnail
var validateThumb = function(body) {
    if(body.thumb && body.thumb.size ) {
      var data = fs.readFileSync(body.thumb.path);
      body.thumb = {
        contentType: body.thumb.mime,
        data: data
      };
  } else {
    delete body.thumb;
  };
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
    model.find({}, callback);
  },

  getItem: function (field, id, callback) {
    var model = getModel(field);
    //Si se trata de una Edition, se formatea y se devuelve
    //Si se trata de otro tipo de item, se buscan y formatean todas
    //sus editions
    model.findById(id, function (err, item) {
      if(model.modelName === 'Editions') {
        me.Edition.formatEditions(item, function (err, formatted) {
          callback(err, formatted[0]);
        })
      } else {
        item.getEditions(function (err, whith_eds) {         
          callback(err, whith_eds);
        });
      };
    });
  },

  updateItem: function(field, id, body, callback) {
    var model = getModel(field);
    validateThumb(body);
    model.update({_id: id}, body, callback);
  },

  addItem: function(field, body, callback) {
    var model = getModel(field);
    validateThumb(body);
    var _new = new model(body);
    _new.save(callback);
  },

  deleteItem: function(field, id, callback) {
    var model = getModel(field),
      Edition = me.Edition;
    if(model.modelName === 'Editions') {
      Edition.remove( {_id: id}, callback);
    } else {
      
      //Si no es una Edition, se borra también el campo
      //correspondiente en las editions que lo contengan.
      //En particular, si es un Course,
      // se borran directamente todas sus Editions.
      
      model.remove({_id: id}, function (err) {

        if(model.modelName === 'Courses') {
          Edition.remove({course: id}, callback);          
        } else {

          //Encuentra el campo correspondiente al item borrado
          for(pathName in Edition.schema.paths) {
            var path = Edition.schema.paths[pathName];
            if(path.options && path.options.ref && path.options.ref === model.modelName)
              var modelPath = pathName;
          }
          search = {};
          search[modelPath] = id;

          Edition.find(search, function (err, items) {
            async.forEach(items, function (item, cb) {

              //WORKAROUND: de momento, se crea una Edition nueva, idéntica salvo
              //por el campo borrado, y se borra la anterior.

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
        };
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