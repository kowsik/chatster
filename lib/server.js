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

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
  socket.on('login', function (nick) {
    socket.set('nick', nick, function () {
      socket.broadcast.emit('login', nick);
      // TODO: Tell this socket who else is on right now and maybe the last
      // 10/20 messages exchanged (need redis for this)
    });
  });

  socket.on('disconnect', function() {
    socket.get('nick', function (err, nick) {
      socket.broadcast.emit('logout', nick);
    });
  });

  socket.on('chat', function(chat) {
    socket.get('nick', function (err, nick) {
      socket.broadcast.emit('chat', { nick: nick, chat: chat });
    });
  });
});

