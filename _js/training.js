$(function() {
  var $document = $(document)
  , scrollTo = function($element) {
    if ($element.length) {
      $('html, body').stop().animate({
        'scrollTop': $element.offset().top - $('.contain-to-grid.nested').height()
      });
    }
  }

  var filters = JSON.parse($('#filters').html());
  var currentFilters = [];

  // show/hide course contents
  $document.on('click', '.js-hide-contents, .js-show-contents', function(e) {

    var $article = $(e.currentTarget).closest('article')
    , $contents = $article.find('.course-contents')
    if (!$contents.height()) {
      $contents.css({
        height: 500,
        opacity: 0
      })
      _.delay(function() {
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

  var courses = $document.find('article').toArray();
  var $filter = $document.find('.filter');
  var $name = $filter.find('input');
  var $noResultsFound = $document.find('.no-results');
  var $results = $document.find('.courses');
  var hasTag = function(course) {
    var tags = course.dataset.labels.split(' ');
    return currentFilters.every(function(filter) {
      return tags.indexOf(filter) != -1;
    })
  }
  var matchText = function(course, inputValue) {
    var name = $(course).find('h1[itemprop=name]').html().toLowerCase();
    var description = $(course).find('[itemprop=description]').html().toLowerCase();
    return name.indexOf(inputValue) != -1 || description.indexOf(inputValue) != -1;
  }

  var doFilter = function() {
    var toHide = [];
    var toShow = [];
    var inputValue = $name.val().toLowerCase();

    courses.forEach(function(course) {
      // if there is no tags selected
      if (currentFilters.length) {
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

  $name.on('keyup', $.throttle(250, doFilter));

  $filter.on('submit', 'form', function(e) {
    e.preventDefault();
    doFilter();
  });

  // update courses with selected labels
  $document.on('click', '.label', function(e) {
    var $target = $(e.target);
    // si se está activando
    if (!$target.hasClass('active')) {
      // if it not a multiple category, we have to deselect the another ones
      var filter = filters[$target.data('name')];
      if (!filter.multiple) {
        // the categories list
        var tmp = $target.parent().parent().find('.label');
        tmp.removeClass('active');
        filter.values.forEach(function(value) {
          var index = currentFilters.indexOf(value);
          index !== -1 && currentFilters.splice(index, 1);
        })
      }
      currentFilters.push($target.data('value'));
    } else {
      // si se está desactivando
      // se quita del filtro
      currentFilters.splice(currentFilters.indexOf($target.data('value')), 1);
    }
    $target.toggleClass('active');

    doFilter();
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
          parts.forEach(function(part) {
            currentFilters.push(part);
            $filter.find('[data-value=' + part + ']').addClass('active');
          })
        }
      }
    }
    doFilter();
  }

})