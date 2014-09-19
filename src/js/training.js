$(function () {  
  var username = 'carlos-coloma'
    , $courseFilter = $('.course-filter a')
    , $container = $("#kcontainer")
  ;

  var renderCalendar = function($items) {
    var uuids = [];
    $items = $items || $courseFilter;
    $items.each(function(i, item) { 
      uuids.push(username + '/' + $(item).data('course'));
    });
    $container.kperf({
      eventUuid: uuids,
      locale: currentLang
    });
  }

  $courseFilter.click(function() {
    var $this = $(this);
    $this.toggleClass('secondary');
    var $selected = $courseFilter.filter(':not(.secondary)');
    renderCalendar($selected.length? $selected : $courseFilter);
  });

  if ($container.size()) {
    renderCalendar();
  }
})