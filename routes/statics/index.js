var Members = require('../../db/models/Members').Members,
  Courses = require('../../db/models/Courses').Courses;

var FeedParser = require('feedparser'),
  parser = new FeedParser(),
  http = require('http'),
  querystring = require('querystring');

module.exports = function (server) {

  //Pasar el atributo selected al tab apropiado
  server.get('/:where?', function (req, res, next) {
    var link = req.params.where ? '/' + req.originalUrl.split('/')[1] : '/';
    res.local('selected', link);
    next();
  });

  //Home page
  server.get('/', function (req, res) {
    Courses.getItems(function (err, items) {
      res.render('statics/index', {
        title: __('Welcome'),
        courses: items
      });      
    });
  });

  //Team page
  server.get('/team', function (req, res) {
    Members.getItems(function (err, items) {
      res.render('statics/team', {
        title: __('Team') + ' | extrema-sistemas.com',
        items: items.sort(function (john, jane) {
          return john.name.localeCompare(jane.name);
        }),
      });
    });
  });

  //Courses page
  server.get('/courses', function (req, res, next) {
    Courses.getItems(function (err, items) {
      res.render('statics/courses', {
        title: __('Courses') + ' | extrema-sistemas.com',
        items: items,
        initialType: req.params.type
      });
    });
  });

  require('./courses')(server);

  //Follow-us page
  server.get('/follow-us', function (req, res) {
    parser.parseUrl('http://blog.extrema-sistemas.com/feed/', function (err, meta, articles) {
      res.render('statics/follow-us', {
        title: __('Follow-us') + ' | extrema-sistemas.com',
        articles: articles,
      });
    });
  });

  //Contact page
  server.get('/contact', function (req, res) {
    res.render('statics/contact', {
      title: __('Contact') + ' | extrema-sistemas.com',
    });
  });

  //Contact form
  server.post('/contact', function (req, res) {
    checkCaptcha(req, function (verified) {
      if(verified) {
        sendEmail(req.body, function (err) {
          res.render('statics/contact', {
            title: __('Contact') + ' | extrema-sistemas.com',
            success: __('sent-mail')
          });
        });
      } else {
        res.render('statics/contact', {
          title: __('Contact') + ' | extrema-sistemas.com',
          error: __('wrong-captcha'),
          fields: req.body
        });
      }
    });
  });

  //Pedir un thumbnail
  server.get('/team/:item/thumb', function (req, res) {
    var id = req.params.item;

    Members.getThumbnail(id, function (err, thumb) {
      if(thumb) {
        res.contentType(thumb.contentType);
        res.send(thumb.data);
      } else {
        res.redirect('/images/person.png');
      }
    });
  });

  //Pedir thumbnail
  server.get('/courses/:item/thumb', function (req, res) {
    var id = req.params.item;

    Courses.getThumbnail(id, function (err, thumb) {
      if(thumb) {
        res.contentType(thumb.contentType);
        res.send(thumb.data);
      } else {
        res.redirect('/images/person.png');
      }
    });
  });

  require('./redirections')(server);

};


var checkCaptcha = function(req, callback) {
  var data = {
    privatekey: '6LcjZdMSAAAAAKzCILUhp8so63rBA7VeYAY3AAUo',
    remoteip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    challenge: req.body.recaptcha_challenge_field,
    response: req.body.recaptcha_response_field
  },
    data_string = querystring.stringify(data);


  var recaptcha = http.request({
    host: 'www.google.com',
    path: '/recaptcha/api/verify',
    port: 80,
    method: 'POST',
    headers: {
      'Content-Length': data_string.length,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }, function (res) {
    var response = '';
    res.on('data', function (chunk) {
      response += chunk;
    });
    res.on('end', function () {
      var responses = response.split('\n');
      if(responses[0] === 'true') {
        callback(true);
      } else {
        callback(false);
      }
    });
  });

  recaptcha.write(data_string);
  recaptcha.end();
}


//Helpers Captcha y mailer
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    XOAuthToken: nodemailer.createXOAuthGenerator({
        user: 'info@extrema-sistemas.com',
        token: '1/FMeGZPPHzish_PtQKqGmdTjPFy0sUIFFvuLv-UvDot8',
        tokenSecret: 'l0zCd5oWC4jx48Ccas-uC0K2'
    })
  }
});

var sendEmail = function (body, callback) {
  var date = new Date (Date.now());

  var mailOptions = {
    from: 'Yourself',
    to: 'info@extrema-sistemas.com',
    subject: 'Nuevo comentario en extrema-sistemas.com',
    html: 'Se ha enviado un nuevo comentario desde http://extrema-sistemas.com/contact.<br><br>' +
            '<b>Fecha</b>: ' + date.toLocaleDateString() + ' , ' + date.toLocaleTimeString() +
            '<br><br><b>Nombre</b>: ' + body.name +
            '<br><br><b>Organización</b>: ' + body.organization + 
            '<br><br><b>Email</b>: ' + body.email + 
            '<br><br><b>Comentario</b>:<br>\"' + body.comment + '\"'
  };

  smtpTransport.sendMail(mailOptions, function (err, res) {
    callback(err);
  });
};