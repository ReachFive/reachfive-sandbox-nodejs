var express = require('express');
var request = require('request');
var jwt = require('jsonwebtoken');
var fs = require('fs');
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
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/widget-auth', function(req, res, next) {
  res.render('widget-auth', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/core-login-with-password', function(req, res, next) {
  res.render('core-login-with-password', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/core-login-with-password-sso', function(req, res, next) {
  res.render('core-login-with-password-sso', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/core-signup', function(req, res, next) {
  res.render('core-signup', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/core-password-reset', function(req, res, next) {
  res.render('core-password-reset', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/widget-passwordless', function(req, res, next) {
  res.render('widget-passwordless', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/widget-social-login', function(req, res, next) {
  res.render('widget-social-login', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/core-social-login', function(req, res, next) {
  res.render('core-social-login', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/widget-user-password-reset', function(req, res, next) {
  res.render('widget-user-password-reset', {
    redirectUri: oauthRedirectUri(req),
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
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
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/widget-user-profile-editor', authenticated, function(req, res, next) {
  res.render('widget-user-profile-editor', {
    name: req.session.name,
    accessToken: req.session.accessToken,
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/widget-user-email-editor', authenticated, function(req, res, next) {
  res.render('widget-user-email-editor', {
    name: req.session.name,
    accessToken: req.session.accessToken,
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/widget-user-password-editor', authenticated, function(req, res, next) {
  res.render('widget-user-password-editor', {
    name: req.session.name,
    accessToken: req.session.accessToken,
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/widget-user-social-accounts', authenticated, function(req, res, next) {
  res.render('widget-user-social-accounts', {
    name: req.session.name,
    idToken: req.session.idToken,
    accessToken: req.session.accessToken,
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/core-user-update-profile', authenticated, function(req, res, next) {
  res.render('core-user-update-profile', {
    name: req.session.name,
    accessToken: req.session.accessToken,
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/core-user-update-email', authenticated, function(req, res, next) {
  res.render('core-user-update-email', {
    name: req.session.name,
    accessToken: req.session.accessToken,
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
  });
});

router.get('/core-user-update-password', authenticated, function(req, res, next) {
  res.render('core-user-update-password', {
    name: req.session.name,
    accessToken: req.session.accessToken,
    reach5Domain: process.env.REACH5_DOMAIN,
    reach5ClientId: process.env.REACH5_CLIENT_ID
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
          'client_secret': process.env.REACH5_CLIENT_SECRET,
          'redirect_uri': oauthRedirectUri(req),
          'grant_type': 'authorization_code'
        }
      },
      function(err, response, body) {
        if (!err && response.statusCode == 200) {
          var authResult = JSON.parse(body);
          var idToken = authResult['id_token'];
          console.log(authResult['id_token']);

          //jwt.verify(idToken, process.env.REACH5_CLIENT_SECRET);
          var cert = fs.readFileSync('public.pem');  // get public key
          var decoded = jwt.verify(idToken, cert);
          console.log(decoded);

          req.session.userId = decoded.sub;
          req.session.name = decoded.name;
          req.session.email = decoded.email;
          req.session.idToken = authResult['id_token'];
          req.session.accessToken = authResult['access_token'];
          res.redirect('/user');
        } else {
          console.error(body);
          res.redirect('/');
        }
      }
    );
  }
);

module.exports = router;
