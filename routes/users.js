const express = require('express');
const router = express.Router();
router.use(express.static('./public'));
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
