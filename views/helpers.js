
module.exports = {
  i18nTextInput: function(label, field, options ,content) {
    var list = '',
      tagOpen = function (locale) {
        var tag = '<input type="text" name="' + field + '.' + locale + '" ' + (options || '');
        if(!content) {
          return tag + '>';
        } else {
          tag += ' value="' + content[locale] + '">';
          return tag;
        }
      },
      locale;

    for (i in appLocales) {
      locale = appLocales[i];
      list += '<div class="control-group"><label>' + label + ' (' + locale + ')</label>' +
              tagOpen(locale) + '</div>';     
    }
    return list;
  },

  i18nTextArea: function(label, field, options, content) {
    var list = '',
      tagOpen = function (locale) {
        var tag = '<textarea rows=5 name="' + field + '.'  + locale + '" ' +
          (options || '') + '>';
        return tag;
      },
      tagClose = '</textarea>',
      locale;

    for (i in appLocales) {
      locale = appLocales[i];
      var text = (content && content[locale]) || '';
      list += '<div class="control-group"><label>' + label + ' (' + locale + ')</label>' +
              tagOpen(locale) + text + tagClose + '</div>';     
    }
    return list;
  },

  courseThumbnail: function (course, lang) {
    var html = '<div class="thumbnail"><img src="/courses/' + course._id +
      '/thumb"><div class="caption"><h4>' + course.name[lang] +
      '</h4></div></div>';
      
    return html;
  },

}