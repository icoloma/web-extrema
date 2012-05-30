
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'extrema-sistemas.com' })
};

exports.team = function(req, res){
  res.render('team', { title: 'Team' })
};