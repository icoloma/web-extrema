module.exports = function (app) {

  app.get('/courses/HTML5-es', function (req, res) {
    res.render('statics/courses/HTML5-es', {title: 'Title'})
  });

  app.get('/courses/HTML5-en', function (req, res) {
    res.render('statics/courses/HTML5-en', {title: 'Title'})
  });

  app.get('/courses/HTML5', function (req, res) {
    res.render('statics/courses/HTML5-' + i18n.getLocale(req), {title: 'Title'})
  });

  app.get('/courses/HTML5-it', function (req, res) {
    res.render('statics/courses/HTML5-it', {title: 'Title'})
  });

  app.get('/courses/javaspecialists', function (req, res) {
    res.render('statics/courses/javaspecialists', {title: 'Title'})
  });

  app.get('/courses/spring', function (req, res) {
    res.render('statics/courses/spring', {title: 'Title'})
  });

}