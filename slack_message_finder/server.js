'use strict';
const express = require('express');
const app = express();
const request = require('request');
const superagent = require('superagent');


app.use(express.static(__dirname + '/build'));



app.get('/', function(req, res) {
  console.log('Visited Index');
  res.redirect(instaLink);
});

app.get('/feed', function(req, res) {
  var code = req.query.code;

  var url = 'https://api.instagram.com/oauth/access_token';
  var options = {
    url: url,
    method: 'POST',
    form: {
      client_id: clientId,
      client_secret: client_secret,
      grant_type: 'authorization_ code',
      redirect_uri: redirect_uri,
      code: code
    },
    json: true
  };

  request(options, function(err, res, body) {
    console.log(body);
  });
});

app.get('/user', function(req, res) {
  var url = 'https://api.instagram.com/v1/users/self/?access_token=' + access_token;

  superagent
    .get(url)
    .end((err, res) => {
      if (err) console.log(err);
      console.log(res.body);
    });
  res.json({Message:'User found'});
});


app.get('/media', function (req, res) {
  console.log('got jere');
  var url = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + access_token;

  let mediaPromise = new Promise((resolve, reject) => {
    superagent
      .get(url)
      .end((err, res) => {
        if(err) return        reject({message: err});

        let mediaArr = res.body.data;
        resolve(mediaArr.map((item, index) => {
          return {
            position: index,
            tags: item.tags,
            comments: item.comments,
            link: item.link,
            likes: item.likes,
            images: item.images,
            caption: item.caption,
            user: item.user
          };
        }));
      });
  });

  mediaPromise.then((mediaData) => {
    res.json({media:mediaData});
  }, (err) => {
    res.json(err);
  });
});


// app.get('/', function(req, res) {
//   let token = req.params.token;
//   request
//     .get('https://slack.com/api/im.list')
//     .end((err, res) => {
//       if (err) console.log(err);
//       console.log(res.body);
//     });
//   res.json({
//     Message: 'Playlist Created!'
//   });
// });
//
// app.get('/channels', function(req, res) {
//   request
//     .get('https://slack.com/api/im.list')
//     .end((err, res) => {
//       if (err) console.log(err);
//       console.log(res.body);
//     });
//   res.json({
//     Message: 'Playlist Created!'
//   });
// });


app.listen(3000, () => {
  console.log('server is running on 3000');
});
