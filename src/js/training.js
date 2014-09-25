$(function() {
  var $document = $(document)

  , scrollTo = function($element) {
    if ($element.length) {
      $('html, body').stop().animate({
        'scrollTop': $element.offset().top - $('.magellan-container').height()
      });
    }
  }

  // show/hide course contents
  $document.on('click', '.js-hide-contents, .js-show-contents', function(e) {

    var $article = $(e.currentTarget).closest('article')
    , $contents = $article.find('.course-contents')
    if (!$contents.height()) {
      $contents.css({
        height: 500,
        opacity: 0
      })
      _.delay(function() {
        $contents.css({
          height: '',
          opacity: 1
        }).addClass('expanded')
      }, 500)
    } else {
      $contents.css('height', $contents.height()).removeClass('expanded')
      _.defer(function() { $contents.css('height', 0) });
    }
    scrollTo($contents);
    $article.find('.js-hide-contents, .js-show-contents').toggleClass('hidden');

  });

  // hide the subsidies container (fundacion tripartita etc) after 5 sec
  var $subsidized = $('.subsidized-container');
  if ($subsidized.length) {
    _.delay(function() {
      $subsidized.addClass('collapsed')
    }, 5000)
    _.delay(function() {
      $subsidized.remove()
    }, 6000)
  }

  // the hash is not working that great with magellan
  if ($('.magellan-container').length && location.hash) {
    scrollTo($(location.hash))
  }

})