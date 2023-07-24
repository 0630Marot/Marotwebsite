const express = require('express');
const router = express.Router();
const testModel=require('../model/testModel');

let count=0;

router.get('/', function(req, res, next) {

  testModel.findOne({ _id: '64b88fb2779ce6378cee1f66' }).then(data => {
    console.log(data.count);
    count=data.count;
    res.render('index',{count:count});
    })

});

router.get('/press',function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  count++;
  testModel.updateOne({ _id: '64b88fb2779ce6378cee1f66' },{count:count}).then(data=>{
    res.send(count.toString());
  });
});
module.exports = router;
