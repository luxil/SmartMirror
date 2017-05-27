var http = require('http');
var	path = require('path');
var express = require('express');
var sockjs  = require('sockjs');
var kalender = require('./app_kalender');
const clientDirectory= path.join(__dirname, 'client');

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js"};
var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function(conn) {
    conn.on('data',function(message)  {
        //console.log("Sending confsignals to CMS", message);
        //conn.write('from server: ' + message);
        console.log("sockjs_echo.on message: " + message);
        if (message == 'getCalEvents') {
            kalender.load_events(function () {
                kalender.returnEventInfos(function (test) {
                    var new_array = ["getCalInfos"].concat(JSON.parse(test));
                    //console.log("returnEventInfos" + new_array);
                    //conn.write('from server: ' + " returnEventInfos " + JSON.stringify(new_array));
                    conn.write(JSON.stringify(new_array));
                    return test;
                });
            });
        }
    });
});


// 2. Express server
var app = express();
var server = http.createServer(app);
sockjs_echo.installHandlers(server, {prefix:'/echo'});

app.use('/', express.static(clientDirectory));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

server.listen(3000, function() {
	console.log('Server listen on port 3000.');
});