
var redirect = function(server, old, newURL) {
  server.get(old, function (req, res) {
    res.redirect(newURL);
  });
}

module.exports = function (server) {


  server.get(/\/es\/.+/, function (req, res, next) {
    res.cookie('language', 'es');
    next();
  });

  redirect(server, '/es/formacion', '/courses');
  redirect(server, '/training', '/courses');
  redirect(server, '/es/formacion/curso-oficial-core-spring-0', '/courses/spring');
  redirect(server, '/solutions', '/'); //
  redirect(server, '/es/formacion/html5-y-css3', '/courses/html5');
  redirect(server, '/training/html5-and-css3', '/courses/html5');
  redirect(server, '/es/registro?cid=Curso Oficial Core Spring&conv=394', '/courses/spring');
  redirect(server, '/training/spring-core-official-course', '/courses/spring');
  redirect(server, '/es/formacion/javaspecialists-master-course', '/courses/javaspecialists');
  redirect(server, '/es/registro?cid=Curso Oficial Core Spring&conv=405', '/courses/spring');
  redirect(server, '/es/registro?cid=Enterprise Integration con Spring&conv=340', '/courses/spring');
  redirect(server, '/clients', '/'); //
  redirect(server, '/about-us', '/');; //
  redirect(server, '/es/soluciones', '/'); //
  redirect(server, '/es/equipo', '/team');
  redirect(server, '/es/clientes', '/'); //


  server.get('/es/contacto', function (req, res) {
    res.redirect('/contact')
  });
};