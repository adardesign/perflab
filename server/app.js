var express = require('express');
var app = express();
var fs = require('fs') 

app.set('view engine', 'ejs')

app.set('port', (process.env.PORT || 5000));

app.use('/client', express.static(__dirname + '/../client/'));

app.get(["/", "/:page"], (req, res) => {
  res.render('../views/index.ejs', {
      pageType:""
  });
});

app.listen(app.get('port'), () => {
  console.log('listening')
});