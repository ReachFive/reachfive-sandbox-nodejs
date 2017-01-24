var express = require('express');
var request = require('request');
var jwt = require('jsonwebtoken');
var router = express.Router();

function siteBaseUrl(req) {
  return req.protocol + '://' + req.get('host');
}

function logoutRedirectTo(req) {
  return siteBaseUrl(req) + '/';
}

function oauthRedirectUri(req) {
  return siteBaseUrl(req) + '/login/callback';
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ReachFive Sandbox' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    res.redirect(
      'https://' + process.env.REACH5_DOMAIN + '/identity/v1/logout?redirect_to=' + encodeURI(logoutRedirectTo(req))
    );
  });
});

router.get(
  '/login/callback',
  function(req, res, next) {
    request.post(
      'https://' + process.env.REACH5_DOMAIN + '/oauth/token',
      {
        form: {
          'code': req.query.code,
          'client_id': process.env.REACH5_CLIENT_ID,
          'redirect_uri': oauthRedirectUri(req),
          'grant_type': 'authorization_code'
        }
      },
      function(err, response, body) {
        if (!err && response.statusCode == 200) {
          var authResult = JSON.parse(body);
          var idToken = authResult['id_token'];
          var decoded = jwt.verify(idToken, process.env.REACH5_CLIENT_SECRET);

          request(
            'https://' + process.env.REACH5_DOMAIN + '/identity/v1/me?fields=id,name',
            {
              headers: {
                'Authorization': 'Id-Token ' + idToken
              }
            },
            function (err, response, body) {
              if (!err && response.statusCode == 200) {
                var user = JSON.parse(body);
                req.session.userId = decoded.sub;
                req.session.name = user.name;
                res.redirect('/user');
              } else {
                console.error(body);
                res.redirect('/login');
              }
            });
        } else {
          console.error(body);
          res.redirect('/login');
        }
      }
    );
  }
);

module.exports = router;
