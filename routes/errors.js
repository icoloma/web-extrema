
module.exports = function(app) {

  app.use(function (req, res, next) {
    if(req.accepts('html')) {
      res.render('statics/404', {
        title: res.__('404-title'),
        status: 404,
        url: req.url
      });
    }
  });
}