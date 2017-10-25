import $ from "jquery";
import { delay, throttle } from 'lodash';

var $document = $(document)
, scrollTo = function($element) {
  if ($element.length) {
    $('html, body').stop().animate({
      'scrollTop': $element.offset().top
    });
  }
}

var $newsletter = document.querySelector('.newsletter');

document.querySelector('.close').addEventListener('click', function(e) {
  $newsletter.classList.remove('show');
})

// show/hide course contents
$document.on('click', '.js-hide-contents, .js-show-contents', function(e) {

  var $article = $(e.currentTarget).closest('article')
  , $contents = $article.find('.course-contents')
  if (!$contents.height()) {
    $contents.css({
      height: 500,
      opacity: 0
    })
    delay(function() {
      $contents.css({
        height: '',
        opacity: 1
      }).addClass('expanded')
    }, 500)
  } else {
    $contents.css('height', $contents.height()).removeClass('expanded')
    _.defer(function() { $contents.css('height', 0) });
  }
  scrollTo($contents);
  $article.find('.js-hide-contents, .js-show-contents').toggleClass('hidden');

});

var filtersHTML = $('#filters').html();
if (filtersHTML) {
  var filters = JSON.parse(filtersHTML);
  var currentFilters = {};

  var courses = $document.find('article').toArray();
  var $filter = $document.find('.filter');
  var $name = $filter.find('input');
  var $noResultsFound = $document.find('.no-results');
  var $results = $document.find('.courses');
  var hasTag = function(course) {
    var tags = course.dataset.labels.split(' ');
    var result = false;
    for (var key in currentFilters) {
      var currentFilter = currentFilters[key];
      result = currentFilter.every(function(filter) {
        return tags.indexOf(filter) != -1;
      })
    }
    return result;
  }
  var matchText = function(course, inputValue) {
    if (!inputValue || !inputValue.length) {
      return true;
    }
    var name = $(course).find('h1[itemprop=name]').html().toLowerCase();
    var description = $(course).find('[itemprop=description]').html().toLowerCase();
    return name.indexOf(inputValue) != -1 || description.indexOf(inputValue) != -1;
  }

  var getInputValue = function() {
    return $name.val().toLowerCase();
  }

  var doFilter = function() {
    var toHide = [];
    var toShow = [];
    var inputValue = getInputValue();
    var areFiltersEmpty = true;
    for (var key in currentFilters) {
      if (currentFilters[key].length) {
        areFiltersEmpty = false;
        break;
      }
    }

    courses.forEach(function(course) {
      // if there is no tags selected
      if (!areFiltersEmpty) {
        if (hasTag(course) && matchText(course, inputValue)) {
          toShow.push(course);
        } else {
          toHide.push(course);
        }
      } else {
        if (matchText(course, inputValue)) {
          toShow.push(course);
        } else {
          toHide.push(course);
        }
      }
    });
    if (!toShow.length) {
      $results.addClass('hide');
      $noResultsFound.removeClass('hide');
    } else {
      $(toShow).removeClass('hide');
      $(toHide).addClass('hide');
      $results.removeClass('hide');
      $noResultsFound.addClass('hide');
    }

  }

  var pushState = function(forceFilter) {
    var query = [];
    var inputValue = getInputValue();
    if (inputValue.trim().length) {
      query.push('q=' + encodeURIComponent(inputValue));
    }
    for (var key in currentFilters) {
      var values = currentFilters[key];
      if (values.length) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(values.join(',')));
      }
    }
    var newPath = location.pathname + '?' + query.join('&');
    // send to google analytics
    ga && ga('send', 'pageview', newPath);

    if (history && history.pushState) {
      history.pushState({},  '', newPath);
    }
    
    forceFilter && doFilter();
  }

  // filter every 250ms
  $name.on('keyup', throttle(doFilter, 250));
  // only update state if the user stop writing
  $name.on('keyup', throttle(function() {
    var inputValue = getInputValue();
    setTimeout(function() {
      if (inputValue === getInputValue()) {
        pushState();    
      }
    }, 1000);
  }, 250));

  $filter.on('submit', 'form', function(e) {
    e.preventDefault();
    pushState(true);
  });

  // update courses with selected labels
  $document.on('click', '.label', function(e) {
    var $target = $(e.target);
    var filterName = $target.data('name');
    if (!currentFilters[filterName]) {
      currentFilters[filterName] = [];
    }
    var currentFilter = currentFilters[filterName];
    // si se está activando
    if (!$target.hasClass('active')) {
      // if it not a multiple category, we have to deselect the another ones
      var filter = filters[filterName];
      if (!filter.multiple) {
        // the categories list
        var tmp = $target.parent().parent().find('.label');
        tmp.removeClass('active');
        filter.values.forEach(function(value) {
          var index = currentFilter.indexOf(value);
          index !== -1 && currentFilter.splice(index, 1);
        })
      }
      currentFilter.push($target.data('value'));
    } else {
      // si se está desactivando
      // se quita del filtro
      currentFilter.splice(currentFilter.indexOf($target.data('value')), 1);
    }
    $target.toggleClass('active');
    pushState(true);
  })

  var query = window.location.search.substring(1);
  if (query) {
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == 'q') {
        $name.val(decodeURIComponent(pair[1]));
      } else {
        if (filters[pair[0]]) {
          var parts = pair[1].split(',');
          currentFilters[pair[0]] = currentFilters[pair[0]] || [];
          parts.forEach(function(part) {
            currentFilters[pair[0]].push(part);
            $filter.find('[data-value=' + part + ']').addClass('active');
          })
        }
      }
    }
    doFilter();
  }
  
}