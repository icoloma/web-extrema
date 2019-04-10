var throttle = function(func, wait, options) {
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
};

// hide newsletter form
const newsletterElement = document.querySelector(".newsletter");
const closeElement = document.querySelector(".close");
closeElement &&
  closeElement.addEventListener("click", function(e) {
    newsletterElement.classList.remove("show");
  });

// show/hide course contents
const courses = document.querySelectorAll(".course-item");
courses.forEach(element => {
  const contentsLinks = element.querySelectorAll(
    ".js-hide-contents, .js-show-contents"
  );
  const contentsElement = element.querySelector(".course-contents");
  element.addEventListener("click", function(e) {
    const target = e.target;
    if (
      target &&
      (target.matches(".js-hide-contents") ||
        target.matches(".js-show-contents"))
    ) {
      contentsElement.classList.toggle("show");
      contentsLinks.forEach(item => item.classList.toggle("hidden"));
    }
  });
});

// if we are in the courses page
const filtersHTML = document.querySelector("#filters");
if (filtersHTML) {
  const filters = JSON.parse(filtersHTML.innerHTML);

  const filterElement = document.querySelector(".filter");
  const noResultsElement = document.querySelector(".no-results");
  const coursesContainerElement = document.querySelector(".courses");

  let currentFilters = {};

  const nameFilterElement = filterElement.querySelector("input");
  const hasTag = function(course) {
    var tags = course.dataset.labels.split(" ");
    var result = false;
    for (var key in currentFilters) {
      var currentFilter = currentFilters[key];
      result = currentFilter.every(function(filter) {
        return tags.indexOf(filter) != -1;
      });
    }
    return result;
  };
  const matchText = function(course, inputValue) {
    if (!inputValue || !inputValue.length) {
      return true;
    }
    const name = course
      .querySelector("h1[itemprop=name]")
      .innerHTML.toLowerCase();
    const description = course
      .querySelector("[itemprop=description]")
      .innerHTML.toLowerCase();
    return (
      name.indexOf(inputValue) != -1 || description.indexOf(inputValue) != -1
    );
  };

  const getInputValue = function() {
    return nameFilterElement.value.toLowerCase();
  };

  const doFilter = function() {
    let toHide = [];
    let toShow = [];
    const inputValue = getInputValue();
    let areFiltersEmpty = true;
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
      coursesContainerElement.classList.add("hide");
      noResultsElement.classList.remove("hide");
    } else {
      toShow.forEach(item => item.classList.remove("hide"));
      toHide.forEach(item => item.classList.add("hide"));
      coursesContainerElement.classList.remove("hide");
      noResultsElement.classList.add("hide");
    }
  };

  const pushState = function(forceFilter) {
    let query = [];
    const inputValue = getInputValue();
    if (inputValue.trim().length) {
      query.push("q=" + encodeURIComponent(inputValue));
    }
    for (var key in currentFilters) {
      const values = currentFilters[key];
      if (values.length) {
        query.push(
          encodeURIComponent(key) + "=" + encodeURIComponent(values.join(","))
        );
      }
    }
    const newPath = location.pathname + "?" + query.join("&");
    // send to google analytics
    window.ga && ga("send", "pageview", newPath);

    if (history && history.pushState) {
      history.pushState({}, "", newPath);
    }

    forceFilter && doFilter();
  };

  // filter every 250ms
  nameFilterElement.addEventListener("keyup", throttle(doFilter, 250));
  // only update state if the user stop writing
  nameFilterElement.addEventListener(
    "keyup",
    throttle(function() {
      const inputValue = getInputValue();
      setTimeout(function() {
        if (inputValue === getInputValue()) {
          pushState();
        }
      }, 1000);
    }, 250)
  );

  filterElement.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    pushState(true);
  });

  // update courses with selected labels
  const labelListener = function(labelElement) {
    var filterName = labelElement.dataset.name;
    if (!currentFilters[filterName]) {
      currentFilters[filterName] = [];
    }
    var currentFilter = currentFilters[filterName];
    // si se está activando
    if (!labelElement.classList.contains("active")) {
      // if it not a multiple category, we have to deselect the another ones
      var filter = filters[filterName];
      if (!filter.multiple) {
        // the categories list
        var tmp = labelElement.parentElement.parentElement.querySelectorAll(
          ".label"
        );
        tmp.forEach(element => element.classList.remove("active"));
        filter.values.forEach(function(value) {
          var index = currentFilter.indexOf(value);
          index !== -1 && currentFilter.splice(index, 1);
        });
      }
      currentFilter.push(labelElement.dataset.value);
    } else {
      // si se está desactivando
      // se quita del filtro
      currentFilter.splice(
        currentFilter.indexOf(labelElement.dataset.value),
        1
      );
    }
    labelElement.classList.toggle("active");
    pushState(true);
  };
  filterElement.addEventListener("click", e => {
    const target = e.target;
    if (target && target.matches(".label")) {
      labelListener(target);
    }
  });

  var query = window.location.search.substring(1);
  if (query) {
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == "q") {
        nameFilterElement.value = decodeURIComponent(pair[1]);
      } else {
        if (filters[pair[0]]) {
          var parts = pair[1].split(",");
          currentFilters[pair[0]] = currentFilters[pair[0]] || [];
          parts.forEach(function(part) {
            currentFilters[pair[0]].push(part);
            filterElement
              .querySelector("[data-value=" + part + "]")
              .classList.add("active");
          });
        }
      }
    }
    doFilter();
  }
}
