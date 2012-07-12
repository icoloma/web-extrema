

module.exports = function (server) {

  var redirect = function(old, newURL) {
    server.get(old, function (req, res) {
      if (/^\/es\//.test(old)) {
        res.clearCookie('language');
        res.cookie('language', 'es');
      }
      res.redirect(newURL);
    });
  };


  redirect('/training', '/courses');
  redirect('/es/formacion', '/courses');
  redirect('/es/formacion/curso-oficial-core-spring-0', '/courses/spring');
  redirect('/es/formacion/html5-y-css3', '/courses/html5');
  redirect('/training/html5-and-css3', '/courses/html5');
  redirect('/training/spring-core-official-course', '/courses/spring');
  redirect('/es/formacion/javaspecialists-master-course', '/courses/javaspecialists');
  redirect('/es/registro', '/courses');
  redirect('/es/equipo', '/team');
  redirect('/about-us', '/team');

  // TODO: Hasta que tengamos los casos de éxito
  redirect('/solutions', '/'); //
  redirect('/es/soluciones', '/'); //
  redirect('/clients', '/'); //
  redirect('/es/clientes', '/'); //
  redirect('/es/contacto', '/contact');
};