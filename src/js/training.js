$(function() {
  var change = function(e) {
    var $this = $(e.target)
      , $nav = $this.parent()
    ;
    $this.closest('article').find('.js-contents').toggleClass('hide');
    $nav.find('.js-hide-contents').toggleClass('hidden');
    $nav.find('.js-show-contents').toggleClass('hidden');
  };
  $('.js-show-contents').click(change);
  $('.js-hide-contents').click(change);

  // hide the tripartita when scrolling down, show when scrolling up
  // http://stackoverflow.com/questions/18604022/slide-header-up-if-you-scroll-down-and-vice-versa
  var $window = $(window)
  , $container = $('.subsidized-container')
  , headerHeight = 100
  , treshold = 0
  , lastScroll = 0

  $container.length && $window.on('scroll', _.throttle(function(e) {
      var newScroll = $window.scrollTop()
      , diff = newScroll - lastScroll;

      // normalize treshold range
      treshold = (treshold + diff > headerHeight) ? headerHeight : treshold + diff;
      treshold = (treshold < 0) ? 0 : treshold;

      $container.toggleClass('collapsed', !!treshold);

      lastScroll = newScroll;
  }, 500));


})