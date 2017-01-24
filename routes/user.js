var express = require('express');
var router = express.Router();

/* GET login listing. */
router.get('/', function(req, res, next) {
  if (req.session.userId) {
    res.render('user', {
      name: req.session.name
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
