var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var rooms = [];

io.on('connection', function(socket){

  socket.on('create room', function(mockupId) {
    var roomId = mockupId + '';
    if(rooms.indexOf(roomId) < 0)
      rooms.push(roomId);
    socket.join(roomId);
    socket.room = roomId;
  });

  socket.on('message', function(msg){
    console.log(socket.room);
    socket.to(socket.room).emit('message', msg);
  });

  socket.on('leave room', function() {
    socket.leave(socket.room);
    socket.disconnect();
    console.log('leave room');
  })
});

http.listen(7000, function(){
  console.log('listening on *:7000');
});
