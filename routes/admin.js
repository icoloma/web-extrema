/*
Rutas para la zona de administración
*/
var db = require('../db');

mongoose.connect('mongodb://localhost/extrema');

module.exports = function (app) {

  app.set('view options', {
    layout: app.path + '/views/layouts/layout-admin'
  });

  app.configure(function(){
    app.set('views', app.path + '/views/admin');
  });

  //Login
  app.get('/user', function (req, res) {
    res.render('login', {title: 'Login' });
  });

  var adminZone = /\/(admin|editions|team|courses|venues).*/;

  app.all(adminZone, function (req, res, next) {
    if(req.session.user_id) {
      res.send('What are u tryin\' 2 do???')
    } else {
      next();
    }
  });

  app.post('/login', function (req, res) {
    if(req.body.user === 'info@extrema-sistemas.com' && req.body.password === 'foo') {
      req.session.user_id = '4S7RYP20OCVZFQASCVE5';
      res.redirect('/admin');
    } else {
      res.send('Bad user/pass');
    };
  });

  //Página principal
  app.get('/admin', function (req, res) {
    res.render('index', { title: 'Admin panel' });
  });

  //Pasar la página de origen y las opciones para 
  //las combo box, para una Edition
  app.get(/\/editions.*/, function (req, res, next) {
    var referer = req.header('Referer')
                    .match(/http.+\/([a-z]+)\/([0-9a-f]+)\/[a-z]*/),
      origin = {},
      field = referer[1];

    origin.address = referer[0];
    origin[field] = referer[2];
    
    db.getAllItems(function (items) {
      var itemList = {
        origin: origin,
        venues: items.venues,
        courses: items.courses,
        members: items.members,
      };
      req.itemList = itemList;
      next();
    });
  }); 

  //Lista de items
  app.get('/:field', function (req, res, next) {
    var field = req.params.field;
    if(db.isModel(field)) {
      db.getItems(field, function (err, items) {
        res.render(field, { 
        title : field,
        items: items
        });
      });
    } else {
      next();
    };
  });

  //Visualizar y editar un item individual
  app.get('/:field/:item/edit', function (req, res) {
    var field = req.params.field,
      id = req.params.item,
      params = {};
    if(req.itemList)
      params = req.itemList;

    db.getItem(field, id, function (err, item, editions) {
      _.extend(params, {
        title: 'Edit ' + (item.name || item.date),
        item: item,
        editions: editions
      });
      res.render(field + '-edit', params);
    });
  });

  //Añadir un nuevo item
  app.get('/:field/new', function (req, res) {
    var field = req.params.field,
      params = {};
    if (req.itemList)
      params = req.itemList;
    _.extend(params, {
      title: 'Add new ' + field + ' item'
    });
    res.render(field + '-new', params);
  });

  /*
  * POST
  */

  //Actualizar un item
  app.post('/:field/:item/update', function(req, res) {
    var field = req.params.field,
      id = req.params.item,
      body = req.body;
    body.thumb = (req.files && req.files.thumb) || undefined;

    db.updateItem(field, id, body, function (err, num) {
      var origin = req.body.origin || ('/' + field);
      res.redirect(origin);
    });
  });

  //Añadir un nuevo item
  app.post('/:field/add', function (req, res) {
    var field = req.params.field,
      body = req.body;
    body.thumb = req.files && req.files.thumb;

    db.addItem(field, body, function (err) {
      var origin = req.body.origin || ('/' + field);
      res.redirect(origin);
    });
  });

  //Borrar un item
  app.post('/:field/:item/delete', function (req, res) {
    var field = req.params.field,
      id = req.params.item;

    db.deleteItem(field, id, function (err) {
      var origin = req.body.origin || ('/' + field);
      res.redirect(origin);
    });
  });

  /****/

  //Pedir un thumbnail
  app.get('/:field/:item/thumb', function (req, res) {
    var field = req.params.field,
      id = req.params.item;

    db.getThumbnail(field, id, function (err, thumb) {
      if(thumb) {
        res.contentType(thumb.contentType);
        res.send(thumb.data);
      } else {
        res.redirect('/images/person.png');
      };
    })
  });

}
