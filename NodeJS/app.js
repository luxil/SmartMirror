var http = require('http');
var	path = require('path');
var express = require('express');
var sockjs  = require('sockjs');
var kalender = require('./app_kalender');
const clientDirectory= path.join(__dirname, 'client');

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js"};
var sockjs_echo = sockjs.createServer(sockjs_opts);
// sockjs_echo.on('connection', function(conn) {
//     conn.on('data', function(message) {
//         conn.write(message);
//     });
// });

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



function initSockjs() {
    var sockjs_url = '/echo';
    var sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        console.log('open client');
        sockjs.send('test');
    };

    sockjs.onmessage = function(e) {
        console.log('message', e.data);
        var div  = $('#calendarBox');
        div.append($("<code>").text(e.data));
        div.append($("<br>"));
        //div.scrollTop(div.scrollTop()+10000);
        //sockjs.close();
    };

    sockjs.onclose = function() {
        console.log('close');
    };
}