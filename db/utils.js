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
  }
};

//Busca todas las editions asociadas a un item dado
var getEditions = function(id, field, callback) {
  var Editions = require('./models/Editions').Editions; 

  var search = {deleted: false};
  search[field] = id;

  Editions.find(search, function (err, editions) {
    Editions.formatEditions(editions, callback);
  });
};

//Métodos que se exportan
exports.statics = {

  getItems: function (callback) {
    this.find({deleted: false}, callback);
  },

  //Método por defecto para un item que tenga editions
  getItemWithEditions: function (id, field, callback) {
    var self = this;
    async.parallel([
      function (cb) {
        self.findById(id, cb);
      }, 
      function (cb) {
        getEditions(id, field, cb);
      }],
      function (err, results) {
        var item = results[0],
          editions = results[1];
        callback(err, item, editions);
      })
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
  //y se borra (borrado lógico) de ellas ese campo.
  deleteItem: function(id, callback) {
    this.update({_id: id}, {deleted: true}, callback);
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
