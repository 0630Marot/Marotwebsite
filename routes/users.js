var express = require('express');
var http = require('http');
var https = require('https');
const cheerio = require('cheerio');
var router = express.Router();
const Model = require('../model/userModel');
const WordModel = require('../model/wordModel')

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.cookies.email) {
    Model.findOne({ email: req.cookies.email }).then(data => {
      if (req.cookies.password == data.password) {
        if (data.permission == 'admin') {
          res.render('users', { permission: `<div id="admin-field"><button id="admin-btn">点击获取新的邀请码</button></div>` });
        } else {
          res.render('users', { permission: '' });
        }
      } else {
        res.redirect('/login')
      }
    });
  }
  else {
    res.redirect('/login');
  }
});

router.post('/check', function (req, res, next) {
  var mark = 0;
  res.setHeader('Access-Control-Allow-Origin', '*');
  const type = parseInt(req.body.type);
  const index = parseInt(req.body.index);
  switch (type) {
    case 1: //check
      update();
      break;
    case 2: //change
      update();
      break;
    case 3: //last
      update(0, -1);
      break;
    case 4: //wrong
      update(1);
      break;
    case 5: //right
      update(-1);
      break;
    case 6: //next
      update(0, 1);
      break;
  }
  function checkword(num = 0) {
    WordModel.findOne({ index: (num + index) }).then(data => {
      let resJson = {
        type: 1,
        index: data.index,
        word: data.word,
        desc: data.description,
        mark: mark,
        // dict: yd(data.word)
      }
      res.send(resJson);
    }).catch(error => {
      res.send({ type: 2, error: error });//超出单词范围
    })
  }
  function update(up = 0, num = 0) {
    Model.findOne({ email: req.cookies.email }).then(data => {
      let arr = data.EnglishCount;
      if ('review' in req.body) {
        const RL = parseInt(req.body.review);
        if (RL > 0) {
          if (num > 0) {
            for (let i = 1; (i + index) < arr.length; i++) {
              if (arr[index + i - 1] === RL) {
                num = i;
                break;
              }
              num = 0;
            }
          } else {
            for (let i = 1; (index - i) >= 0; i++) {
              if (arr[index - i - 1] === RL) {
                num = - i;
                break;
              }
              num = 0;
            }
          }
        }

      }
      if (arr.length < index + num) {
        arr = arr.concat(new Array(index + num - arr.length).fill(0));
      }
      mark = arr[index + num - 1] + up;
      if (mark < 0) { mark = 0; }
      if (up != 0) {
        arr[index - 1] = mark;
        Model.updateOne({ _id: data.id }, { $set: { EnglishCount: arr } }).then(data => {
          res.send({ type: 3, mark: mark });
        });
      } else {
        checkword(num);
      }
    });
  }
});
router.post('/yd', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const word = req.body.word;
  const targetUrl = 'http://dict.youdao.com/jsonapi?jsonversion=2&client=mobile&q=' + word + '&dicts=%7B%22count%22%3A99%2C%22dicts%22%3A%5B%5B%22ec%22%2C%22ce%22%2C%22newcj%22%2C%22newjc%22%2C%22kc%22%2C%22ck%22%2C%22fc%22%2C%22cf%22%2C%22multle%22%2C%22jtj%22%2C%22pic_dict%22%2C%22tc%22%2C%22ct%22%2C%22typos%22%2C%22special%22%2C%22tcb%22%2C%22baike%22%2C%22lang%22%2C%22simple%22%2C%22wordform%22%2C%22exam_dict%22%2C%22ctc%22%2C%22web_search%22%2C%22auth_sents_part%22%2C%22ec21%22%2C%22phrs%22%2C%22input%22%2C%22wikipedia_digest%22%2C%22ee%22%2C%22collins%22%2C%22ugc%22%2C%22media_sents_part%22%2C%22syno%22%2C%22rel_word%22%2C%22longman%22%2C%22ce_new%22%2C%22le%22%2C%22newcj_sents%22%2C%22blng_sents_part%22%2C%22hh%22%5D%2C%5B%22ugc%22%5D%2C%5B%22longman%22%5D%2C%5B%22newjc%22%5D%2C%5B%22newcj%22%5D%2C%5B%22web_trans%22%5D%2C%5B%22fanyi%22%5D%5D%7D&keyfrom=mdict.7.2.0.android&model=honor&mid=5.6.1&imei=659135764921685&vendor=wandoujia&screen=1080x1800&ssid=superman&network=wifi&abtest=2&xmlVersion=5.1';
  // const targetUrl=url;
  const targetReq = http.request(targetUrl, targetRes => {
    let resData = '';
    targetRes.on('data', chunk => {
      resData += chunk;
    });
    targetRes.on('end', () => {
      const jsonData = JSON.parse(resData);
      if ('word' in jsonData.ec) {
        const wiki = 'wikipedia_digest' in jsonData ? jsonData.wikipedia_digest.summarys : '';
        const newJson = {
          wiki: wiki,
          yd: jsonData.ec.word
        };
        res.send(newJson);
      } else {
        res.send({ error: 1 });
      }
      // console.log(jsonData.ec.word.word);

    })

  })
  req.pipe(targetReq);
});
router.post('/etymonline', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const word = req.body.word;
  const targetUrl = 'https://www.etymonline.com/cn/word/' + word + '?utm_source=search';
  const targetReq = https.request(targetUrl, targetRes => {
    let resData = '';
    targetRes.on('data', chunk => {
      resData += chunk;
    });
    targetRes.on('end', () => {
      const $ = cheerio.load(resData);
      // 查找特定的 <div class="word"> 内容
      const wordDiv = $('.word__defination--2q7ZH').html();
      let newJson = {
        word: req.body.word,
        et: wordDiv
      }
      res.send(newJson);
    })

  })
  req.pipe(targetReq);
});
module.exports = router;
