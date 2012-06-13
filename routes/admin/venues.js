var Venues = require(appPath + '/db/models/Venues').Venues;

module.exports = function (app) {

  //Pasar la página de origen y las opciones para 
  //las combo box, para una Edition

  //Lista de items
  app.get('/venues', function (req, res, next) {
    Venues.getItems(function (err, items) {
      res.render('venues', {
        title: 'Venues',
        items: items
      })
    });
  });

  //Visualizar y editar un item individual
  app.get('/venues/:item/edit', function (req, res) {
    var id = req.params.item;

    Venues.getItem(id, function (err, item, editions) {
      res.render('venues-edit', {
        title: 'Edit ' + item.name,
        item: item,
        editions: editions 
      });
    });
  });

  //Añadir un nuevo item
  app.get('/venues/new', function (req, res) {
    res.render('venues-new', {
      title: 'Add new venue'
    });
  });

  /*
  * POST
  */

  //Actualizar un item
  app.post('/venues/:item/update', function (req, res) {
    var id = req.params.item,
      body = req.body;
    body.thumb = (req.files && req.files.thumb) || undefined;

    Venues.updateItem(id, body, function (err, num) {
      res.redirect('/venues');
    });
  });

  //Añadir un nuevo item
  app.post('/venues/add', function (req, res) {
    var body = req.body;
    body.thumb = req.files && req.files.thumb;

    Venues.addItem(body, function (err) {
      res.redirect('/venues')
    });
  });

  //Borrar un item
  app.post('/venues/:item/delete', function (req, res) {
    var id = req.params.item;

    Venues.deleteItem(id, function (err) {
      res.redirect('/venues');
    });
  });

  /****/

  //Pedir un thumbnail
  app.get('/venues/:item/thumb', function (req, res) {
    var id = req.params.item;

    Venues.getThumbnail(id, function (err, thumb) {
      if(thumb) {
        res.contentType(thumb.contentType);
        res.send(thumb.data);
      } else {
        res.redirect('/images/person.png');
      }
    });
  });

}