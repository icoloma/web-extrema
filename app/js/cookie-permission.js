$(function() {

  var cookieName = 'acceptscookies'
    , acceptscookies = undefined
    , analytics = function() {
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-2309405-1']);
        _gaq.push(['_trackPageview']);
        (function() {
          var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
          ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })(); 
      }
  ;

  $.each(document.cookie.split(';'), function(index, item) { 
    parts = $.trim(item).split('=');
    if (cookieName == parts[0]) {
      acceptscookies = parts[1];
    }
  });

  if (!acceptscookies) {
    $('.cookie-container').removeClass('hidden');
    $('.accept-cookies').on('click', function() {
      document.cookie = cookieName + '=accepted;max-age=3153600000';
      $('.cookie-container').hide(400);
      analytics();
    });
  } else {
    analytics();
  }

});