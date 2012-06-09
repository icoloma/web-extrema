/*
Rutas para la zona de administración
*/
var db = require('../db');

mongoose.connect('mongodb://localhost/extrema');

module.exports = function (app) {

  app.get('/:field', function (req, res, next) {
    var field = req.params.field;
    if(db.isModel(field)) {
      db.getItems(field, function (err, items) {
        res.render('admin/' + field, { 
        title : field,
        items: items
        });
      });
    } else {
      next();
    };
  });

  app.get('/:field/:item/edit', function (req, res) {
    var field = req.params.field,
      id = req.params.item;
    db.getItem(field, id, function(err, item) {
      res.render('admin/' + field + '-edit', {
        title: 'Edit ' + item.name,
        item: item
      });
    });
  });

  app.get('/:field/new', function (req, res) {
    var field = req.params.field;
    res.render('admin/' + field + '-new', {title: 'Add new ' + field + ' item'});
  });

  app.post('/:field/:item/update', function(req, res) {
    var field = req.params.field,
      id = req.params.item,
      body = req.body;
    body.thumb = req.files.thumb;

    db.updateItem(field, id, body, function (err, num) {
      res.redirect('/' + field);
    });
  });

  app.post('/editions/add', function (req, res) {
    var field = 'editions',
      body = req.body;
    db.addItem(field, body, function (err) {
      res.redirect(body.origin);
    });
  });

  app.post('/:field/add', function (req, res) {
    var field = req.params.field,
      body = req.body;
    body.thumb = req.files.thumb;

    db.addItem(field, body, function (err) {
      res.redirect('/' + field);
    });
  });

  app.post('/:field/:item/delete', function (req, res) {
    var field = req.params.field,
      id = req.params.item;

    db.deleteItem(field, id, function (err) {
      res.redirect('/' + field);
    });
  });

  app.get('/admin', function (req, res) {
    res.render('admin', { title: 'Admin panel' });
  });

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
    // db.getItem(field, id, function (err, item) {
    //   if(item.picture && item.picture.data) {
    //     res.contentType(item.picture.contentType);
    //     res.send(item.picture.data);
    //   } else {
    //     res.redirect('/images/person.png');
    //   };
    // });
  });

  //Usa POST para pasar el origin
  //Seguro que puede hacerse más sencillo
  app.post('/editions/new', function (req, res) {
    var origin = {
      courses: req.body.course,
      venues: req.body.venue,
      team: req.body.instructor,
    };
    for(p in origin) {
      var x = p;
      if(origin[p])
        origin.address = '/' + p + '/' + origin[p] + '/edit'; 
    };

    db.getAllItems(function (items) {
      res.render('admin/editions-new', {
        title: 'Modify edition',
        origin: origin,
        venues: items.venues,
        courses: items.courses,
        members: items.members,
      })
    });

  });

}
