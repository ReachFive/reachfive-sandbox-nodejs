var express = require('express');
var router = express.Router();

/* GET login listing. */
router.get('/', function(req, res, next) {
  if (req.session.userId) {
    res.render('profile', {
      name: req.session.name,
      reach5Domain: process.env.REACH5_DOMAIN
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
