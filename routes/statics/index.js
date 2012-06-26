var Members = require('../../db/models/Members').Members,
  Courses = require('../../db/models/Courses').Courses;

var FeedParser = require('feedparser'),
  parser = new FeedParser();

module.exports = function (server) {

  server.configure(function () {
    server.set('views', appPath + '/views');
  });

  //Home page
  server.get('/', function (req, res) {
    Courses.getItems(function (err, items) {
      res.render('statics/index', {
        title: 'extrema-sistemas.com',
        courses: items
      });      
    });
  });

  //Team page
  server.get('/team', function (req, res, next) {
    Members.getItems(function (err, items) {
      res.render('statics/team', {
        title: __('Team') + ' | extrema-sistemas.com',
        items: items.sort(function (john, jane) {
          return john.name.localeCompare(jane.name);
        }),
      });
    });
  });

  //Follow-us page
  server.get('/follow-us', function (req, res, next) {
    parser.parseUrl('http://blog.extrema-sistemas.com/feed/', function (err, meta, articles) {
      res.render('statics/follow-us', {
        title: __('Follow-us') + ' | extrema-sistemas.com',
        articles: articles,
      });
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

  require('./courses')(server);
}