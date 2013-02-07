var Members = require(appPath + '/db/models/Members').Members,
 Studies = require(appPath + '/db/models/Studies').Studies;

var parseTags = function (body) {
  var plainList = body.substring(1, body.length-1),
    list = plainList.split(',');
  return list.map(function (item) {
    return item.substring(1, item.length-1);
  });
}

module.exports = function (app) {

  //Team page
  app.get('/team', function (req, res) {
    async.parallel([
      function (cb) {
        Members.getItems(cb);
      },
      function (cb) {
        Studies.getItems(cb);
      }],
      function (err, results) {
        var items = results[0],
          study = _.shuffle(results[1])[0];
        res.render('statics/team', {
          title: __('Team') + ' | extrema-sistemas.com',
          items: items,
          study: study
        });
      });
  });

  //Pedir un thumbnail
  app.get('/team/:item/thumb', function (req, res) {
    var id = req.params.item;

    Members.getThumbnail(id, function (err, thumb) {
      if(thumb) {
        res.contentType(thumb.contentType);
        res.send(thumb.data);
      } else {
        res.redirect('/images/person.png');
      }
    });
  });

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

    body.tags = parseTags(body.tags);

    Members.updateItem(id, body, function (err, num) {
      res.redirect('/team');
    });
  });

  //Añadir un nuevo item
  app.post('/team/add', function (req, res) {
    var body = req.body;
    body.thumb = req.files && req.files.thumb;

    body.tags = parseTags(body.tags);

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