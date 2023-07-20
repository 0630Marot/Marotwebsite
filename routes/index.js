const express = require('express');
const router = express.Router();
const testModel=require('../model/testModel');
router.use(express.static('./public'));

let count=0;
/* GET home. */
router.get('/', function(req, res, next) {

  testModel.findOne({ _id: '64b88fb2779ce6378cee1f66' }).then(data => {
    console.log(data.count);
    count=data.count;
    res.render('index',{count:count});
    })

});

router.post('/press',function(req, res, next) {
  count++;

  testModel.updateOne({ _id: '64b88fb2779ce6378cee1f66' },{count:count}).then(data=>{
    res.render('index',{count:count});
  });
});
module.exports = router;
