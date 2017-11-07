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
  res.render('index', {
    title: 'ReachFive Sandbox',
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

router.get('/auth', function(req, res, next) {
  res.render('auth', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

router.get('/login-with-password-core', function(req, res, next) {
  res.render('login-with-password-core', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

router.get('/signup-core', function(req, res, next) {
  res.render('signup-core', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

router.get('/passwordless', function(req, res, next) {
  res.render('passwordless', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

router.get('/social-login', function(req, res, next) {
  res.render('social-login', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

router.get('/social-login-core', function(req, res, next) {
  res.render('social-login-core', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

const authenticated = function(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/');
  }
};

router.get('/user', authenticated, function(req, res, next) {
  res.render('user', {
    name: req.session.name,
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

router.get('/profile', authenticated, function(req, res, next) {
  res.render('profile', {
    name: req.session.name,
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

router.get('/email-editor', authenticated, function(req, res, next) {
  res.render('email-editor', {
    name: req.session.name,
    reach5Domain: process.env.REACH5_DOMAIN
  });
});

router.get('/password-editor', authenticated, function(req, res, next) {
  res.render('password-editor', {
    name: req.session.name,
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

          req.session.userId = decoded.sub;
          req.session.name = decoded.name;
          res.redirect('/user');

        } else {
          res.redirect('/');
        }
      }
    );
  }
);

module.exports = router;
