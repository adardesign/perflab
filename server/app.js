const express = require('express');
var app = express();
var fs = require('fs')

app.set('view engine', 'ejs')

app.set('port', (process.env.PORT || 5000));

// caching..
app.use((req, res, next) => {
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
app.use('/service-worker.js', express.static(__dirname + '/../client/js/service-worker.js'));
app.use('/manifest.json', express.static(__dirname + '/../client/manifest.json'));



app.get("/", (req, res) => {
    var options = {
        root: __dirname + '/../client/'
    };
    if (req.query.fragment) {
        setTimeout((function() {
            res.sendFile("homepage.content.html", options);
        }), 900);

    } else {
        res.sendFile("homepage.html", options);
    }
});


app.get("/appshell.html", (req, res) => {
    var options = {
        root: __dirname + '/../client/'
    };
    res.sendFile("appshell.html", options);
});


app.listen(app.get('port'), () => {
    console.log('listening')
});