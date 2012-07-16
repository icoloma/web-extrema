var Studies = require(appPath + '/db/models/Studies').Studies;

module.exports = function (app) {

  //Visualizar y editar un item individual
  app.get('/studies/:item/edit', function (req, res) {
    var id = req.params.item;

    Studies.getItem(id, function (err, item) {
      res.render('admin/studies-edit', {
        title: 'Edit ' + item.name,
        item: item
      });
    });
  });

  //Añadir un nuevo item
  app.get('/studies/new', function (req, res) {
    res.render('admin/studies-new', {
      title: 'Add new study'
    });
  });

  /*
  * POST
  */

  //Actualizar un item
  app.post('/studies/:item/update', function (req, res) {
    var id = req.params.item,
      body = req.body;
    body.thumb = (req.files && req.files.thumb) || undefined;

    Studies.updateItem(id, body, function (err, num) {
      res.redirect('/studies');
    });
  });

  //Añadir un nuevo item
  app.post('/studies/add', function (req, res) {
    var body = req.body;
    body.thumb = req.files && req.files.thumb;

    Studies.addItem(body, function (err) {
      res.redirect('/studies')
    });
  });

  //Borrar un item
  app.post('/studies/:item/delete', function (req, res) {
    var id = req.params.item;

    Studies.deleteItem(id, function (err) {
      res.redirect('/studies');
    });
  });

  /****/

  // //Pedir un thumbnail
  // app.get('/studies/:item/thumb', function (req, res) {
  //   var id = req.params.item;

  //   Studies.getThumbnail(id, function (err, thumb) {
  //     if(thumb) {
  //       res.contentType(thumb.contentType);
  //       res.send(thumb.data);
  //     } else {
  //       res.redirect('/images/person.png');
  //     }
  //   });
  // });

}