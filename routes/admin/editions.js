var Editions = require(appPath + '/db/models/Editions').Editions,
  db = require(appPath + '/db');

module.exports = function (app) {

  //Pasar la página de origen y las opciones para 
  //las combo box, para una Edition
  app.get(/\/editions.*/, function (req, res, next) {
    if(req.header('Referer')) {
      var referer = req.header('Referer')
                      .match(/http.+\/([a-z]+)\/([0-9a-f]+)\/[a-z]*/),
        origin = {},
        field = referer[1];

      origin.address = referer[0];
      origin[field] = referer[2];
    } else {
      var origin = { address: '/admin' };
    }

    db.getAllItems(function (lists) {
      var editionOptions = {
        origin: origin,
        venues: lists.venues,
        courses: lists.courses,
        members: lists.members,
      };
      req.editionOptions = editionOptions;
      next();
    });
  }); 

  //Visualizar y editar un item individual
  app.get('/editions/:item/edit', function (req, res) {
    var id = req.params.item,
      options = req.editionOptions;

    Editions.getItem(id, function (err, item) {
      res.render('admin/editions-edit', {
        title: 'Edit ' + item.date,
        item: item,
        venues: options.venues,
        courses: options.courses,
        members: options.members,
        origin: options.origin
      });
    });
  });

  //Añadir un nuevo item
  app.get('/editions/new', function (req, res) {
    var options = req.editionOptions;

    res.render('admin/editions-new', {
      title: 'Add new edition',
      venues: options.venues,
      courses: options.courses,
      members: options.members,
      origin: options.origin
    });
  });

  /*
  * POST
  */

  //Actualizar un item
  app.post('/editions/:item/update', function(req, res) {
    var id = req.params.item,
      body = req.body;

    Editions.updateItem(id, body, function (err, num) {
      var origin = req.body.origin;
      res.redirect(origin);
    });
  });

  //Añadir un nuevo item
  app.post('/editions/add', function (req, res) {
    var body = req.body;

    Editions.addItem(body, function (err) {
      var origin = req.body.origin;
      res.redirect(origin);
    });
  });

  //Borrar un item
  app.post('/editions/:item/delete', function (req, res) {
    var id = req.params.item;

    Editions.deleteItem(id, function (err) {
      var origin = req.body.origin;
      res.redirect(origin);
    });
  });

}
