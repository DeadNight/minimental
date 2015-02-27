/**
 * Created by nirleibo on 2/26/15.
 */

var express = require('express');
var router = express.Router();

/* GET logout. */
router.get('/', function(req, res, next) {
  delete req.session.user;
  res.send('ok');
});

module.exports = router;
