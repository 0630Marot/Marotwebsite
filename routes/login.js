var express = require('express');
var router = express.Router();
const Model = require('../model/userModel');
const Model2 = require('../model/inviteModel');

router.get('/', function (req, res, next) {

  // for(let i=0;i<5;i++){
  //   Model2.create({
  //     permission:'visitor',
  //     host:'1',
  //   }).then(data=> {

  //     console.log(data);
  // });
  // }

  res.render('login');
});

router.post('/authentication', function (req, res, next) {
  // res.redirect('/users');
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  Model.findOne({ email: req.body.email }).then(data => {
    if (!req.body.pass) {
      res.send('4');//empty password
    } else if (req.body.pass == data.password) {
      res.cookie('email', req.body.email);
      res.cookie('password', req.body.pass)
      // res.location('/users');
      // res.redirect(301,'/users');
      res.send('0');//login success
    } else {
      res.send('1');//wrong password
    }
  }).catch(error => {
    Model2.findById(req.body.pass).then(data => {
      if (data) {
        console.log(data);
        res.send('2');//new account
      } else {
        res.send('3');//invalid invite
      }
    }).catch(error => {
      res.send('3');//invalid invite
    });
  });
})
router.post('/newaccount', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.body.newpass) {
    if (req.body.newpass.length > 5) {
      const pattern = /^[a-zA-Z0-9@#$%^&*]+$/;
      if (pattern.test(req.body.newpass)) {
        Model2.findById(req.body.pass).then(data => {
          Model.find({}).sort({ _id: -1 }).limit(1).then(innerdata => {
            console.log(innerdata[0].index);
            Model.create({
              index: 1 + innerdata[0].index,
              username: req.body.username,
              password: req.body.newpass,
              email: req.body.email,
              permission: data.permission,
              EnglishCount: [ {
                dicname: "IELTS",
                count: [-1],
            }]
            }).then(innerdata => {
              console.log(innerdata);
              Model2.findByIdAndDelete(req.body.pass).then(thisdata => {
                res.cookie('email', req.body.email);
                res.cookie('password', req.body.newpass)
                res.send('11')//new account
                // res.redirect('/users');
              });

            }).catch(error => {
              console.log(error);
              res.send('12');//new account error
            });
          })

        }).catch(error => {
          console.log(error);
          console.log('13 invalid invite');
          res.send('13');//invalid invite
        });
      } else {
        res.send('14');//invalid char
      }
    } else {
      res.send('15');//password too short
    }
  } else {
    res.send('16');//empty password
  }
});
module.exports = router;
