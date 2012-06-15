var Courses = require(appPath + '/db/models/Courses').Courses;

module.exports = function (app) {
  
  //Lista de items
  app.get('/courses', function (req, res, next) {
    Courses.getItems(function (err, items) {
      res.render('admin/courses', {
        title: 'Courses',
        items: items
      })
    });
  });

  //Visualizar y editar un item individual
  app.get('/courses/:item/edit', function (req, res) {
    var id = req.params.item;

    Courses.getItem(id, function (err, item, editions) {
      res.render('admin/courses-edit', {
        title: 'Edit ' + item.name.en,
        item: item,
        editions: editions 
      });
    });
  });

  //Añadir un nuevo item
  app.get('/courses/new', function (req, res) {
    res.render('admin/courses-new', {
      title: 'Add new course'
    });
  });

  /*
  * POST
  */

  //Actualizar un item
  app.post('/courses/:item/update', function (req, res) {
    var id = req.params.item,
      body = req.body;
    body.thumb = (req.files && req.files.thumb) || undefined;

    Courses.updateItem(id, body, function (err, num) {
      res.redirect('/courses');
    });
  });

  //Añadir un nuevo item
  app.post('/courses/add', function (req, res) {
    var body = req.body;
    body.thumb = req.files && req.files.thumb;

    Courses.addItem(body, function (err) {
      res.redirect('/courses')
    });
  });

  //Borrar un item
  app.post('/courses/:item/delete', function (req, res) {
    var id = req.params.item;

    Courses.deleteItem(id, function (err) {
      res.redirect('/courses');
    });
  });

  /****/

  //Pedir un thumbnail
  app.get('/courses/:item/thumb', function (req, res) {
    var id = req.params.item;

    Courses.getThumbnail(id, function (err, thumb) {
      if(thumb) {
        res.contentType(thumb.contentType);
        res.send(thumb.data);
      } else {
        res.redirect('/images/person.png');
      }
    });
  });

}