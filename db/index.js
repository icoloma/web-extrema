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
        me.Editions.formatEditions(item, function (err, formatted) {
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
      Editions = me.Editions;

    model.remove({_id: id}, function (err) {
      if (model.modelName === 'Editions') {
        callback(err);
      } else if (model.modelName === 'Courses') {
        Editions.remove({course: id}, callback);
      } else {
        for(pathName in Editions.schema.paths) {
          var path = Editions.schema.paths[pathName];
          if(path.options && path.options.ref && path.options.ref === model.modelName)
            var modelPath = pathName;
        };
        var search = {};
        search[modelPath] = id;
        Editions
          .update(search, { $unset: search }, {multi: true}, callback);
      };
    });
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
    model.findById(id, function (err, item) {
      var thumb = false;
      if(!err && item.thumb && item.thumb.data) {
        thumb = {
          data: item.thumb.data,
          contentType: item.thumb.contentType
        };
      };
      callback(err, thumb);
    })
  }

});