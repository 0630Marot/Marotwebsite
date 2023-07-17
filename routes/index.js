const express = require('express');
const router = express.Router();
router.use(express.static('./public'));
/* GET home. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
module.exports = router;
