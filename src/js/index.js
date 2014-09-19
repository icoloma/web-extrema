$(function () {
  var $studies = $('.case-studies li');
  var study = $studies.get(Math.floor(Math.random() * ($studies.size())));
  $('.studies-container').append(study);
})