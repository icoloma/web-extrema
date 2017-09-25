import $ from 'jquery';
import 'whatwg-fetch';

const map = $('.map');
if (map.length) {
  // TODO: monitor size changes? I dont think it's necessary 
  let contentUrl = window.innerWidth > 1024? '/map-large.html' : '/map-small.html';
  fetch(contentUrl).then((resp) => resp.text()).then((content) => {
    map.html(content);
  })
}