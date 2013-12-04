$(function() {
  var parts = location.pathname.split('/');
  var lang = $.inArray(parts[1], Extrema.languages) != -1? '/' + parts[1] : '';
  $.ajax({
    url: lang + '/studies',
    success: function(html) {
      var $studies = $($(html).find('.study'))
        , study = $studies.get(Math.floor(Math.random() * $studies.size())).innerHTML
      ;
      $('.selected-study').prepend(study);
    }
  });
});