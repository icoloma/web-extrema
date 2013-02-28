module.exports = function (app) {

  app.get('/courses/html5', function (req, res) {
    res.render('statics/courses/html5-' + i18n.getLocale(req), {
      title: __('Course-contents')
    });
  });

  app.get('/courses/spring-([^\/\.]+)$', function (req, res) {
    res.render('statics/courses/spring-' + req.params[0] + '-' + i18n.getLocale(req), {
      title: __('Course-contents')
    });
  });

  // app.get(/\/courses\/([^\/\.]+)$/, function (req, res, next) {
  //   if(req.params[0] !== 'new') {
  //     res.render('statics/courses/' + req.params[0], {title: __('Course-contents')})
  //   } else {
  //     next();
  //   }
  // });
}