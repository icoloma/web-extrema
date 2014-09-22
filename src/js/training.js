$(function() {
  var $showBtn = $('.js-show-contents')
    , $hideBtn = $('.js-hide-contents')
    , $contents =$('.js-contents')
    , change = function() {
      $contents.toggleClass('hide');
      $showBtn.toggleClass('hidden');
      $hideBtn.toggleClass('hidden');
    }
  ;
  $showBtn.click(change);
  $hideBtn.click(change);
})