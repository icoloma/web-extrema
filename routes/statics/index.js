var Members = require('../../db/models/Members').Members,
  Courses = require('../../db/models/Courses').Courses;

var FeedParser = require('feedparser'),
  parser = new FeedParser(),
  http = require('http'),
  querystring = require('querystring');


var checkCaptcha = function(body, callback) {
  var data = {
    privatekey: '6LcjZdMSAAAAAKzCILUhp8so63rBA7VeYAY3AAUo',
    remoteip: '88.12.26.48',
    challenge: body.recaptcha_challenge_field,
    response: body.recaptcha_response_field
  },
    data_string = querystring.stringify(data);


  var recaptcha = http.request({
    host: 'www.google.com',
    path: '/recaptcha/api/verify',
    port: 80,
    method: 'POST',
    headers: {
      'Content-Length': data_string.length,
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
  recaptcha.end()
}

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
    to: 'rvidal@extrema-sistemas.com',
    subject: 'Nuevo comentario en extrema-sistemas.com',
    html: 'Se ha enviado un nuevo comentario desde http://extrema-sistemas.com/contact.<br><br>' +
            '<b>Fecha</b>: ' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() +
            '<br><br><b>Nombre</b>: ' + body.name +
            '<br><br><b>Organización</b>: ' + body.organization + 
            '<br><br><b>Email</b>: ' + body.email + 
            '<br><br><b>Comentario</b>:<br>\"' + body.comment + '\"'
  };

  smtpTransport.sendMail(mailOptions, function (err, res) {
    callback(err);
  });
}


module.exports = function (server) {

  server.configure(function () {
    server.set('views', appPath + '/views');
  });

  //Home page
  server.get('/', function (req, res) {
    Courses.getItems(function (err, items) {
      res.render('statics/index', {
        title: 'extrema-sistemas.com',
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

  //Follow-us page
  server.get('/follow-us', function (req, res) {
    parser.parseUrl('http://blog.extrema-sistemas.com/feed/', function (err, meta, articles) {
      res.render('statics/follow-us', {
        title: __('Follow-us') + ' | extrema-sistemas.com',
        articles: articles,
      });
    });
  });

  var alert_message = '';

  //Contact page
  server.get('/contact', function (req, res) {
    res.render('statics/contact', {
      title: __('Contact') + ' | extrema-sistemas.com',
      alert: alert_message
    });
  });

  //Contact form
  server.post('/send-comment', function (req, res) {
    checkCaptcha(req.body, function (verified) {
      if(verified) {
        sendEmail(req.body, function (err) {
          alert_message = '';
          res.redirect('/contact');
        });
      } else {
        alert_message = 'Ooops'
        res.redirect('/contact');
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

  require('./courses')(server);
}