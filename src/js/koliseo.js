$(function() {


  // KOLISEO

  window.Koliseo = window.Koliseo || {};
  Koliseo.resources = {
      en: {
      ticketsAvailable: 'tickets available',
      seeOther: 'see other dates',
      empty: 'There are no performances scheduled for this event.',
      dateFormat: 'Ddd Mm* d* h*:mm a.m',
      weekStart: 0,
      weekDays: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday',
      months: 'January February March April May June July August September October November December'
    },
    es: {
      ticketsAvailable: 'de entradas disponibles',
      seeOther: 'ver otras fechas',
      empty: 'No hay actuaciones programadas para este evento.',
      dateFormat: 'Ddd d* de Mm* HH:mm',
      weekStart: 1,
      weekDays: 'Domingo Lunes Martes Miércoles Jueves Viernes Sábado',
      months: 'Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre'
    },
    it: {
      ticketsAvailable: 'biglietti disponibili',
      seeOther: 'vedi altre date',
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
            var performances = $.makeArray(cursor.data);
            var size = performances.length;
            var renderPerformances = function(page) {
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
                    '<li><p class="kperformance" title="' + pct + '% ' + res.ticketsAvailable + '">' +
                      '<a class="kperflink ' + ticketsClass + (pct === 0? ' disabled' : '') + '" href="' + getEventURL(perf.event.uuid) + '?selected=' + perf.id + '" target="_blank">' +             
                        '<b class="kperfdate">' + formatDate(res.dateFormat, perf.dateTimeStr) + '</b> ' +
                        availableTickets + '/' + perf.totalTickets  + '<span class="kicon-ticket"></span> ' +
                        ' <span class="kprice">' + perf.minPrice + ' ' + perf.currency + '</span> ' + 
                      '</a>' +
                      '<span class="kaddr">' + perf.address + '</span>' +
                    '</p></li>'
                  ));
                });
                $item.html($list);
                $item.append('<div class="kcontrols">' + 
                  (page > 0? '<a class="js-kcontrol left" data-page="' + (page - 1) + '">&laquo; Previous</a>' : '') +
                  (size - pageSize * (page) > pageSize? '<a class="js-kcontrol right" data-page="' + (page + 1) + '">Next &raquo;</a>' : '') +
                  '</div>');
                $item.click('.js-kcontrol', function(e) {
                  var $this = $(e.target);
                  renderPerformances(+$this.data('page'));
                });
              } else {
                $item.html('<p>' + res.empty + '</p>');
              }
              _.defer($item.removeClass, 'loading');
            }
            renderPerformances(0);
          }
        })
      }
  ;

  var $elements = $('.kcontainer:empty')
  , THRESHOLD = 500
  , $window = $(window)
  , check = function(e) {
    if ($elements.length) {
      var scrollTop = $window.scrollTop()
      $elements.each(function() {
        var $this = $(this);
        if ($this.offset().top - scrollTop < THRESHOLD) {
          $this.addClass('loading');
          // implementar la carga
          loadPerformances($this);
        }
      })
      _.defer(function() {
        $elements = $elements.filter(":not(.loading):empty");
      })
    }
  }

  $window.scroll(_.throttle(check, 500))
  //$window.resize(_.throttle(check, 500))

})