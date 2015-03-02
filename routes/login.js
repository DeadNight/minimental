/**
 * Created by nirleibo on 2/26/15.
 */

var express = require('express');
var router = express.Router();

/* GET login. */
router.get('/', function(req, res, next) {
  req.session.user = req.query.user;
  res.send('ok');
});

module.exports = router;
