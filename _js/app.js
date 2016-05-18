$(function () {

  // FOUNDATION

  $(document).foundation();
  
  // COOKIES

  var cookieName = 'acceptscookies'
    , accepts = undefined
    , $window = $(window)
    , initScrollPosition = $window.scrollTop()
    , throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
          previous = options.leading === false ? 0 : new Date().getTime();
          timeout = null;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        };
        return function() {
          var now = new Date().getTime();
          if (!previous && options.leading === false) previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
      }
    , analytics = function() {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-2309405-1', 'auto');
        ga('send', 'pageview');
      }
  ;

  $.each(document.cookie.split(';'), function(index, item) { 
    parts = $.trim(item).split('=');
    if (cookieName == parts[0]) {
      accepts = parts[1];
    }
  });

  if (!accepts) {
    $('.cookie-container').removeClass('hide');
    var acceptCookies = function() {
      document.cookie = cookieName + '=accepted;max-age=3153600000';
      $('.cookie-container').hide(400);
      accepts = true;
      analytics();
    }
    $window.scroll(throttle(function() {
      if (!accepts && Math.abs($window.scrollTop() - initScrollPosition) >= 400) {
        acceptCookies();
      }
    }, 100));
    $('.accept-cookies').on('click', acceptCookies);
  } else {
    analytics();
  }

})