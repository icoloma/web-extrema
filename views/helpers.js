module.exports = {

  // courseThumbnail: function (course, lang) {
  //   var html = '<div class="thumbnail"><img src="/courses/' + course._id +
  //     '/thumb"><div class="caption"><h4>' + course.name[lang] +
  //     '</h4></div></div>';
      
  //   return html;
  // },

  stylesheetsMixin: function() {
    return environment === 'development'? 
      '<link rel="stylesheet" href="/stylesheets/bootstrap.css">' +
      '<link rel="stylesheet" href="/stylesheets/bootstrap-responsive.css">' +
      '<link rel="stylesheet" href="/stylesheets/style.css">'
      :
      '<link rel="stylesheet" href="/stylesheets/style.min.css">'
  },

  javascriptsMixin: function() {
    return environment === 'development'? 
      '<script type="text/javascript" src="/javascripts/jquery-1.7.2.min.js"></script>' +
      '<script type="text/javascript" src="/javascripts/bootstrap-dropdown.js"></script>' +
      '<script type="text/javascript" src="/javascripts/bootstrap-tab.js"></script>' +
      '<script type="text/javascript" src="/javascripts/bootstrap-collapse.js"></script>' +
      '<script type="text/javascript" src="/javascripts/touch-devices.js"></script>'
      :
      '<script type="text/javascript" src="/javascripts/scripts.min.js"></script>'
  }
};