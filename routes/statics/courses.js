module.exports = function (app) {

  app.get(/\/courses\/([^\/\.]+)$/, function (req, res) {
    res.render('statics/courses/' + req.params[0], {title: __('Course-contents')})
  });

}