/*
*   Métodos genéricos

  Se cargan como métodos statics en todos los Schemas

*/

//Funciones de apoyo

//Valida que se recibe una imagen
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

//Busca el nombre del campo correspondiente en el EditionSchema
var getEditionField = function(model) {
  var Editions = require('./models/Editions').Editions; 

  for (pathName in Editions.schema.paths) {
    var path = Editions.schema.paths[pathName];
    if(path.options && path.options.ref && path.options.ref === model.modelName)
      var modelPath = pathName;
  };
  return modelPath;
};

//Busca todas las editions asociadas a un item dado
var getEditions = function(model, callback) {
  var Editions = require('./models/Editions').Editions; 

  var search = {},
    modelPath = getEditionField(model);
  search[modelPath] = model._id;
 
  Editions.find(search, function (err, editions) {
    Editions.formatEditions(editions, callback);
  });
};

//Métodos que se exportan
exports.statics = {

  getItems: function (callback) {
    this.find({}, callback);
  },

  //Método por defecto para un item que tenga editions
  getItemWithEditions: function (id, callback) {
    this.findById(id, function (err, item) {
      getEditions(this, function (err, editions) {
        item.editions = editions;
        callback(err, item);
      });
    });
  },
  
  addItem: function(body, callback) {
    validateThumb(body);
    var _new = new this(body);
    _new.save(callback);
  },

  updateItem: function(id, body, callback) {
    validateThumb(body);
    this.update({_id: id}, body, callback);
  },

  //Método por defecto
  //Se buscan las editions que contengan el item
  //y se borra de ellas ese campo.
  deleteItem: function(id, callback) {
    var self = this;
    this.remove({_id: id}, function (err) {
      var Editions = require('./models/Editions').Editions; //??

      var search = {},
        modelPath = getEditionField(self);
      search[modelPath] = id;
      Editions
        .update(search, { $unset: search }, {multi: true}, callback);
    });
  },

  getThumbnail: function(id, callback) {
    this.findById(id, function (err, item) {
      var thumb = false;
      if(!err && item.thumb && item.thumb.data) {
        thumb = {
          data: item.thumb.data,
          contentType: item.thumb.contentType
        };
      };
      callback(err, thumb);
    })
  },
};
