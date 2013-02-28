if(Modernizr.touch) {
  $('.courses-home [data-course-title]').each(function () {
    $('<div></div>').addClass('course-title')
      .append($('<h4></h4>').text($(this).attr('data-course-title')))
      .append($('<hr>').appendTo($(this)))
      .prependTo($(this));
  });
}