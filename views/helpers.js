
module.exports = {

  courseThumbnail: function (course, lang) {
    var html = '<div class="thumbnail"><img src="/courses/' + course._id +
      '/thumb"><div class="caption"><h4>' + course.name[lang] +
      '</h4></div></div>';
      
    return html;
  },

}