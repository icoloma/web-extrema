module.exports = {

  // courseThumbnail: function (course, lang) {
  //   var html = '<div class="thumbnail"><img src="/courses/' + course._id +
  //     '/thumb"><div class="caption"><h4>' + course.name[lang] +
  //     '</h4></div></div>';
      
  //   return html;
  // },

  stylesheetsMixin: function() {
    return stylesheetsBlock();
  },

  javascriptsMixin: function() {
    return javascriptsBlock();
  }
};

var stylesheetsBlock = function() {
  var dev_block = '<link rel="stylesheet" href="/stylesheets/bootstrap.css">' +
                  '<link rel="stylesheet" href="/stylesheets/bootstrap-responsive.css">' +
                  '<link rel="stylesheet" href="/stylesheets/style.css">';

  var prod_block = '<link rel="stylesheet" href="/stylesheets/style.min.css">';

  if(environment === 'production') {
    return prod_block;
  } else if(environment === 'development') {
    return dev_block;
  }
};

var javascriptsBlock = function () {
  var dev_block = '<script type="text/javascript" src="/javascripts/jquery-1.7.2.min.js"></script>' +
                  '<script type="text/javascript" src="/javascripts/bootstrap-dropdown.js"></script>' +
                  '<script type="text/javascript" src="/javascripts/bootstrap-tab.js"></script>' +
                  '<script type="text/javascript" src="/javascripts/bootstrap-collapse.js"></script>';

  var prod_block = '<script type="text/javascript" src="/javascripts/scripts.min.js"></script>';

  if(environment === 'production') {
    return prod_block;
  } else if(environment === 'development') {
    return dev_block;
  }
};