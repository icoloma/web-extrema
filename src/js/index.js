import $ from "jquery";

var $studies = $('.case-study');
var study = $studies.get(Math.floor(Math.random() * ($studies.length)));
$('.studies-container').append(study);