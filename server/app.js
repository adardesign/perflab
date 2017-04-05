var express = require('express');
var app = express();


app.set('port', (process.env.PORT || 5000));
//app.use(express.static(__dirname + '/../client/'));
app.use('/', express.static(__dirname + '/../client/'));

app.listen(app.get('port'));

