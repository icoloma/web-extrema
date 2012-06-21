var Members = require(appPath + '/db/models/Members').Members;

module.exports = function (app) {

  //Visualizar y editar un item individual
  app.get('/team/:item/edit', function (req, res) {
    var id = req.params.item;

    Members.getItem(id, function (err, item, editions) {
      res.render('admin/team-edit', {
        title: 'Edit ' + item.name,
        item: item,
        editions: editions 
      });
    });
  });

  //Añadir un nuevo item
  app.get('/team/new', function (req, res) {
    res.render('admin/team-new', {
      title: 'Add new team member'
    });
  });

  /*
  * POST
  */

  //Actualizar un item
  app.post('/team/:item/update', function (req, res) {
    var id = req.params.item,
      body = req.body;
    body.thumb = (req.files && req.files.thumb) || undefined;

    Members.updateItem(id, body, function (err, num) {
      res.redirect('/team');
    });
  });

  //Añadir un nuevo item
  app.post('/team/add', function (req, res) {
    var body = req.body;
    body.thumb = req.files && req.files.thumb;

    Members.addItem(body, function (err) {
      res.redirect('/team')
    });
  });

  //Borrar un item
  app.post('/team/:item/delete', function (req, res) {
    var id = req.params.item;

    Members.deleteItem(id, function (err) {
      res.redirect('/team');
    });
  });

  /****/

  // //Pedir un thumbnail
  // app.get('/team/:item/thumb', function (req, res) {
  //   var id = req.params.item;

  //   Members.getThumbnail(id, function (err, thumb) {
  //     if(thumb) {
  //       res.contentType(thumb.contentType);
  //       res.send(thumb.data);
  //     } else {
  //       res.redirect('/images/person.png');
  //     }
  //   });
  // });

}