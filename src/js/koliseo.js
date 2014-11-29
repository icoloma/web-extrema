$(function() {


  // KOLISEO

  window.Koliseo = window.Koliseo || {};
  Koliseo.resources = {
      en: {
      ticketsAvailable: 'seats available',
      seeOther: 'see other dates',
      buy: 'Register for ',
      empty: 'No courses scheduled. <a href="mailto:training@extrema-sistemas.com?subject=New+Courses" target="_blank">Get in contact with us</a> if you would like to get notified of any changes.',
      dateFormat: 'Ddd Mm* d*',
      weekStart: 0,
      weekDays: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday',
      months: 'January February March April May June July August September October November December'
    },
    es: {
      ticketsAvailable: 'plazas disponibles',
      seeOther: 'ver otras fechas',
      buy: 'Registrarse para ',
      empty: 'No hay cursos programados. <a href="mailto:training@extrema-sistemas.com?subject=New+Courses" target="_blank">Ponte en contacto</a> para recibir una notificación ante posibles cambios.',
      dateFormat: 'Ddd d* de Mm*',
      weekStart: 1,
      weekDays: 'Domingo Lunes Martes Miércoles Jueves Viernes Sábado',
      months: 'Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre'
    },
    it: {
      ticketsAvailable: 'biglietti disponibili',
      seeOther: 'vedi altre date',
      buy: 'Registrare per ',
      empty: 'Nessuno spettacolo trovato',
      dateFormat: 'Ddd Mm* d*',
      weekDays: 'Domenica Lunedì Martedì Mercoledì Giovedì Venerdì Sabato',
      months: 'Gennaio Febbraio Marzo Aprile Maggio Giugno Luglio Agosto Settembre Ottobre Novembre Dicembre'
    }
  };


  var res = Koliseo.resources[currentLang]
    , getEventURL = function(eventUuid) {
        return (isOldIE() ? document.location.protocol : 'https:') + '//www.koliseo.com/' + eventUuid;
      }
    , pageSize = 5
    /* Detect IE 8 and 9*/
    , isOldIE = function() {
        return navigator.userAgent.match(/.+MSIE [89]\.0.+/);
      }
    , toPercentage = function(value) {
        return +((value * 100).toFixed(0));
      }
    /** format a date to the current locale */
    , formatDate = function(format, dateTimeStr) {
        var 
          date = new Date(dateTimeStr),
          parts = /(\d+)-(\d+)-(\d+)T(\d+):(\d+)/.exec(dateTimeStr),
          year = parts[1],
          month = parts[2],
          day = parts[3],
          hour = parts[4],
          hour12 = String(Number(hour) % 12 ? Number(hour) % 12 : 12),
          am = Number(hour) < 12 ? true : false, 
          minute = parts[5],
          nm = res.months.split(' ')[month - 1],
          nd = res.weekDays.split(' ')[date.getUTCDay()],
          padLeft = function(str) {
            str = String(str);
            var pad = "00";
            return pad.substring(0, pad.length - str.length) + str;
          };

        return format
          .replace(/yyyy/g, year)
          .replace(/yy/g, year.substr(2,2))
          .replace(/MMM/g, nm.substr(0,3).toUpperCase())
          .replace(/Mmm/g, nm.substr(0,3))
          .replace(/MM\*/g, nm.toUpperCase())
          .replace(/Mm\*/g, nm)
          .replace(/mM/g, padLeft(month))
          .replace(/DDD/g, nd.substr(0,3).toUpperCase())
          .replace(/Ddd/g, nd.substr(0,3))
          .replace(/DD\*/g, nd.toUpperCase())
          .replace(/Dd\*/g, nd)
          .replace(/dd/g, padLeft(day))
          .replace(/d\*/g, day)
          .replace(/HH/g, padLeft(hour))
          .replace(/H\*/g, hour)
          .replace(/hh/g, padLeft(hour12))
          .replace(/h\*/g, hour12)
          .replace(/mm/g, padLeft(minute))
          .replace(/AM/g, am ? "AM" : "PM")
          .replace(/am/g, am ? "am" : "pm")
          .replace(/A\.M/g, am ? "A.M." : "P.M.")
          .replace(/a\.m/g, am ? "a.m." : "p.m.")
          ;
      }
    , loadPerformances = function($item) {
        var eventUuid = $item.data('eventUuid');
        $.ajax({
          url: getEventURL(eventUuid) + '/performances',
          data: {
            minDate: new Date().valueOf(),
            pageSize: 100
          },
          dataType: 'json',
          type: 'GET',
          success: function(cursor) {
            var oldHeight = $item.height()
            var performances = $.makeArray(cursor.data);
            var size = performances.length;
            var renderPerformances = function(page) {
              var $content = $('<div class="kcontent"></div>');
              if (size) {
                var $list = $('<ul class="kperformances">')
                $.each(performances.slice(page * pageSize, page * pageSize + pageSize), function(i, perf) {
                  var availableTickets = perf.totalTickets - perf.soldTickets
                    , pct = toPercentage(availableTickets / perf.totalTickets)
                    , ticketsClass = pct === 0? 'kticket-soldout' :
                      pct < 20? 'kticket-danger' :
                      pct < 40? 'kticket-warning' :
                      'kticket-ok'
                  ;
                  $list.append($(
                    '<li><div class="kperformance" title="' + pct + '% ' + res.ticketsAvailable + '">' +
                      '<a class="kperflink ' + ticketsClass + (pct === 0? ' disabled' : '') + '" href="' + getEventURL(perf.event.uuid) + '?selected=' + perf.id + '" target="_blank">' +             
                        '<span class="icon-right-open"></span> ' + res.buy + ' ' + '<span class="kperfdate">' + formatDate(res.dateFormat, perf.dateTimeStr) + '</span> ' +
                      '</a>' +
                      '<span class="kaddr"> &middot; ' + perf.address + /*' &middot; ' +
                        availableTickets + '/' + perf.totalTickets  + ' ' + res.ticketsAvailable + ' ' + */
                      '</span>' +
                    '</div></li>'
                  ));
                });
                $content.append($list);
                $content.append('<div class="kcontrols">' + 
                  (page > 0? '<a class="kcontrol left" data-page="' + (page - 1) + '">&laquo; Previous</a>' : '') +
                  (size - pageSize * (page) > pageSize? '<a class="kcontrol right" data-page="' + (page + 1) + '">Next &raquo;</a>' : '') +
                  '</div>');
                $content.find('.kcontrol').click(function(e) {
                  var $this = $(e.target);
                  renderPerformances(+$this.data('page'));
                });
              } else {
                $content.append('<p>' + res.empty + '</p>')
              }
              $item.html($content).addClass('populated');
              var scrollTop = $window.scrollTop();
              if (scrollTop > $item.offset().top) {
                $window.scrollTop(scrollTop + $item.height() - oldHeight);
              }
            }
            renderPerformances(0);
          }
        })
      }
  ;

  var THRESHOLD = 200
  , $window = $(window)
  , check = function(e) {
    $('.kcontainer:not(.populated)').each(function() {
      var scrollTop = $window.scrollTop()
      var $this = $(this);
      if ($this.offset().top - scrollTop - $window.height() < THRESHOLD) {
        // http://webdesign.tutsplus.com/tutorials/creating-a-collection-of-css3-animated-pre-loaders--cms-21978
        $this.html('<div id="preloader_2"> <span></span> <span></span> <span></span> <span></span> </div>');
        $window.scrollTop(scrollTop + $this.height());
        loadPerformances($this);
      }
    })
  }

  $window.scroll(_.throttle(check, 500))
  //$window.resize(_.throttle(check, 500))

})