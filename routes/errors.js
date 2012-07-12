
module.exports = function(app) {

  app.use(function (req, res, next) {
    if(req.accepts('html')) {
      res.render('statics/404', {
        title: __('404-title'),
        status: 404,
        url: req.url
      });
    }
  });

  app.error(function (err, req, res, next) {
    res.render('statics/500', {
      title: __('500-title'),
      status: 500
    });
  });

}