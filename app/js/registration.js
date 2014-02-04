$(function() {
  var parts = location.pathname.split('/');
  if (parts[1] == 'koliseo') {
    location = 'https://www.koliseo.com/extremasistemas/' + parts[2];
  }
});