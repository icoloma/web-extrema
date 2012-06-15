
module.exports = function (app) {
  
  app.set('view options', {
    layout: appPath + '/views/layouts/layout'
  });

  app.configure(function () {
    app.set('views', appPath + '/views');
  });

  //Home page
  app.get('/', function (req, res) {
    res.render('index', {
      title: 'extrema-sistemas.com'
    })
  });

  // //Team page
  // app.get('/team', function (req, res) {
  //   res.render('team', {
  //     title: 'Team | extrema-sistemas.com'
  //   })
  // })
}