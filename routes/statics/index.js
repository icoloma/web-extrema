var Members = require('../../db/models/Members').Members,
  Courses = require('../../db/models/Courses').Courses;


module.exports = function (server) {

  server.configure(function () {
    server.set('views', appPath + '/views');
  });

  //Home page
  server.get('/', function (req, res) {
    res.render('index', {
      title: 'extrema-sistemas.com'
    })
  });

  //Team page
  server.get('/team', function (req, res, next) {
    Members.getItems(function (err, items) {
      res.render('team', {
        title: 'Team',
        items: items
      })
    });
  });

    //Pedir un thumbnail
  server.get('/team/:item/thumb', function (req, res) {
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

  //Courses page
  server.get('/courses', function (req, res, next) {
    Courses.getItems(function (err, items) {
      res.render('admin/courses', {
        title: 'Courses',
        items: items
      })
    });
  });

  //Pedir thumbnail
  server.get('/courses/:item/thumb', function (req, res) {
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