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
})