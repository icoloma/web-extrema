$(function () {
  var $studies = $('.case-study');
  var study = $studies.get(Math.floor(Math.random() * ($studies.size())));
  $('.studies-container').append(study);
})