
var _ = require('underscore');


module.exports = {};

['Course',
  'Edition',
  'Member',
  'Venue'].forEach(function(name) {
    _.extend(module.exports, require('./' + name + '.js'));
  });

