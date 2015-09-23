/**
 * Created by alexanderkozovski on 9/22/15.
 */
var io = require('socket.io')();

//io.on('connection', function (socket) {
//    socket.emit('news', { hello: 'world' });
//    socket.on('my other event', function (data) {
//        console.log(data);
//    });
//});

var session_ids =[01,02,03,04,05,06,07];
//
//var counter = 0;
//io.on('connection',  function(socket){
//    counter ++;
//    console.log('a user connected', counter);
//    socket.on('disconnect', function(){
//        counter--;
//        console.log('user disconnected', counter);
//    })
//})

io.on('connection', function(socket){
    console.log('conection')
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
});

module.exports = io;