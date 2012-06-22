
var Courses = require(appPath + '/db/models/Courses').Courses;

module.exports = function (server) {

  server.get('/courses', function (req, res, next) {
    Courses.getItems(function (err, items) {
      res.render('statics/courses', {
        title: __('Courses') + ' | extrema-sistemas.com',
        items: items,
        initialType: req.params.type
      })
    });
  });


};