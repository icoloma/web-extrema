//Objeto para modelar los campos
//que requieran i18n

var exports;

appLocales.forEach(function (locale) {
  exports[locale] = String;
});

module.exports = exports;