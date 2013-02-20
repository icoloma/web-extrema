

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


  // Callbacks para los cursos de Spring en Koliseo (redirigidos desde vmware)
  redirect('/koliseo/core-spring-madrid', 'https://www.koliseo.com/extremasistemas/core-spring-madrid');
  redirect('/koliseo/core-spring-barcelona', 'https://www.koliseo.com/extremasistemas/core-spring-barcelona');
  redirect('/koliseo/core-spring-milano', 'https://www.koliseo.com/extremasistemas/core-spring-milano');
  redirect('/koliseo/core-spring-roma', 'https://www.koliseo.com/extremasistemas/core-spring-roma');

  redirect('/koliseo/spring-web-madrid', 'https://www.koliseo.com/extremasistemas/spring-web-madrid');
  redirect('/koliseo/spring-web-barcelona', 'https://www.koliseo.com/extremasistemas/spring-web-barcelona');
  redirect('/koliseo/spring-web-milano', 'https://www.koliseo.com/extremasistemas/spring-web-milano');
  redirect('/koliseo/spring-web-roma', 'https://www.koliseo.com/extremasistemas/spring-web-roma');

  redirect('/koliseo/enterprise-integration-with-spring-madrid', 'https://www.koliseo.com/extremasistemas/enterprise-integration-with-spring-madrid');
  redirect('/koliseo/enterprise-integration-with-spring-barcelona', 'https://www.koliseo.com/extremasistemas/enterprise-integration-with-spring-barcelona');
  redirect('/koliseo/enterprise-integration-with-spring-milano', 'https://www.koliseo.com/extremasistemas/enterprise-integration-with-spring-milano');
  redirect('/koliseo/enterprise-integration-with-spring-roma', 'https://www.koliseo.com/extremasistemas/enterprise-integration-with-spring-roma');
  redirect('/koliseo/core-spring-training-madrid', 'https://www.koliseo.com/extremasistemas/core-spring-training-madrid');


};