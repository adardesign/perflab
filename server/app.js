const cacheVersion = "6"; // not used when taken from firebase.
const express = require('express');
var app = express();
var fs = require('fs') 
var request = require('request');

app.set('view engine', 'ejs')

app.set('port', (process.env.PORT || 5000));

// caching..
app.use( (req, res, next) => {
    //if (req.url.match(/\.(css|js|img|font|html)\/.+/)) {
        // res.setHeader('Cache-Control', 'public, max-age=3600')
        // res.setHeader('test-eb', 'OK')
    //}
    next();
});

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.use('/client', express.static(__dirname + '/../client/'));

// service-worker
app.use('/service-worker.js', express.static(__dirname+ '/../client/js/service-worker.js'));
app.use('/manifest.json', express.static(__dirname+ '/../client/manifest.json'));

app.get("/appShell", (req, res) => {
      res.render('../views/appShell.ejs');
});

app.get(["/", "/:page", "/:catagory/:page"], (req, res) => {
  const url = 'https://perflab-163717.firebaseio.com/.json';
  let pageType = req.params && req.params.catagory ? req.params.catagory : "top level";
    request(url, (error, response, body)=> {
      if (!error && response.statusCode === 200) {
          responseJson = JSON.parse(body);
          cacheVersion = responseJson.cacheVersion  || cacheVersion;
          res.render('../views/index.ejs', {
            request:req,
            pageType:pageType,
            cacheVersion:cacheVersion,
            currentUrl:req.url
        });
      } else {
          res.render('../views/index.ejs', {
          pageType:"Home",
          request:req,
          cacheVersion:cacheVersion,
          currentUrl:req.url
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