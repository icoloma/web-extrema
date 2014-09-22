$(function () {

  // FOUNDATION

  $(document).foundation({
    tab: {
      deep_linking: true,
      scroll_to_content: false
    }
  });
  
  //KOLISEO

  window.Koliseo = window.Koliseo || {};
  Koliseo.resources = {
    it: {
      ticketsAvailable: 'biglietti disponibili',
      seeOther: 'vedi altre date',
      buy: 'Compra',
      empty: 'Nessuno spettacolo trovato',
      dateFormat: 'Ddd Mm* d*',
      weekDays: 'Domenica Lunedì Martedì Mercoledì Giovedì Venerdì Sabato',
      months: 'Gennaio Febbraio Marzo Aprile Maggio Giugno Luglio Agosto Settembre Ottobre Novembre Dicembre'
    }
  };

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