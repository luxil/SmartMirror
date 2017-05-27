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

//kalender.load_client_secrets();

//console.log("app: " + jsonTest);
sockjs_echo.on('connection', function(conn) {
    conn.on('data',function(message)  {
        console.log("Sending confsignals to CMS", message);
        conn.write('from server: ' + message);
        kalender.load_events(function () {
            kalender.returnEventInfos(function (test) {
                console.log("returnEventInfos" + test);
                conn.write('from server: ' + " returnEventInfos " + test);
            });

        });
        // var jsonTest = kalender.returnEventInfos();
        // /*var jsonTest = */kalender.load_events(function() {
        //     kalender.returnEventInfos();
        // });

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


function messageHandler(msg) {

    var messageHandlerMap = {
        0: newNetworkHandler,
        1: updateNetworkHanlder
    }
    var message = JSON.parse(msg.data);
    console.log(message);
    messageHandlerMap[message.id](message);
}



// var test = $.getscript("/client/app_kalender.js",function(){
//     kalender.load_client_secrets();
// });

// const http = require('http');
// 		path = require('path');
//
// //const handle = require('./handle')
// //const handle = require('./server/handle') mit Ordnerstruktur
// //const handle = require('.test')
// const express = require('express');
//
// const clientDirectory= path.join(__dirname, 'client');
//
// const app = express();
//
// app.use('/', express.static(clientDirectory));
//
// app.get('/', (req, res) => {
// 	res.send('Hallo Node.js!!');
//
// });
//
// const server = http.createServer(app);
//
// server.listen(3000, () => {
// 	console.log('Server listen on port 3000.');
// });


// console.log(' [*] Listening on 0.0.0.0:3000' );
// app.listen(3000, '0.0.0.0');

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/client/index.html');
// });