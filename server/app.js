var cacheVersion = "3";
var express = require('express');
var app = express();
var fs = require('fs') 
var request = require('request');

app.set('view engine', 'ejs')

app.set('port', (process.env.PORT || 5000));

// caching..
app.use(function (req, res, next) {
    //if (req.url.match(/\.(css|js|img|font|html)\/.+/)) {
        res.setHeader('Cache-Control', 'public, max-age=3600')
        res.setHeader('test-eb', 'OK')
    //}
    next();
});


app.use('/client', express.static(__dirname + '/../client/'));



// service-worker
app.use('/service-worker.js', express.static(__dirname+ '/../client/js/service-worker.js'));

app.get(["/", "/:page"], (req, res) => {
  const url = 'https://perflab-163717.firebaseio.com/.json';
    request(url, (error, response, body)=> {
      if (!error && response.statusCode === 200) {
          responseJson = JSON.parse(body)
          res.render('../views/index.ejs', {
          pageType:"remote",
          cacheVersion:responseJson.cacheVersion
        });
      } else {
          res.render('../views/index.ejs', {
          pageType:"",
          cacheVersion:cacheVersion
        });
      }
    });
});



app.get("/api/getAsyncData", (req, res) => {
  res.json({
    cacheVersion:cacheVersion
  });
});

app.listen(app.get('port'), () => {
  console.log('listening')
});


// https://github.com/mdn/sw-test
// https://github.com/pinterest/service-workers
// https://github.com/pinterest/service-workers/tree/master/packages/service-worker-plugin
// https://github.com/lyzadanger/pragmatist-service-worker
// https://github.com/delapuente/service-workers-101
// https://github.com/pazguille/offline-first
// https://github.com/hemanth/awesome-pwa
// https://www.torahanytime.com/#/lectures?a=41219
// https://addyosmani.com/blog/application-shell/
// https://googlechrome.github.io/samples/service-worker/post-message/