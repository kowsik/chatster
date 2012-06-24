var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);

var port = process.env.PORT || 9292;
console.log("starting on port " + port);

app.listen(port);

app.configure(function() {
  app.register('.haml', require('hamljs/lib/haml'));
  app.set('view engine', 'haml');
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
  res.render('index');
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
});

