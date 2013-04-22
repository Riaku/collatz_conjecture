var express = require('express')
    , http = require('http')
    , async = require('async');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(100);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    socket.emit('message',{msg:'waiting for input...'})
    socket.on('number', function (data) {
        console.log(data.msg);
        var num = data.msg;
        var x = 0;
        async.series([
            function(callback){
                if(!isNaN(num) && !(num < 1)){
                    while(num != 1){
                        x++;
                        console.log(x);
                        if(isOdd(num)){
                            num = (num*3)+1;
                            socket.emit('message',{msg:num})
                        } else {
                            num = num/2;
                            socket.emit('message',{msg:num});
                        }
                    }
                } else {
                    socket.emit('message',{msg:'use numbers you dolt!'})
                }
                callback(null, 1);
            },
            function(callback){
                console.log(x)
                socket.emit('message',{msg:'iterations: '+x})
            }
        ]);
    });
});
function isOdd(num) { return num % 2;}