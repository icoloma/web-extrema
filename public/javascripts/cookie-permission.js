$(function() {
  $('.accept-cookies').on('click', function() {
    document.cookie = 'acceptscookies=accepted;max-age=3153600000'
    $('.cookie-container').hide(400);
  });
});