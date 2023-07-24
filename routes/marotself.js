var express = require('express');
var router = express.Router();
const Model=require('../model/wordModel');

router.get('/', function(req, res, next) {
  Model.find({index:1}).then(data=>{
    console.log(data);
  })
  res.render('wordpage');
});


module.exports = router;
