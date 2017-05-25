var http = require('http');
var	path = require('path');
var express = require('express');
var sockjs  = require('sockjs');
const clientDirectory= path.join(__dirname, 'client');

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js"};
var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(message) {
        conn.write(message);
    });
});

// 2. Express server
var app = express();
var server = http.createServer(app);

sockjs_echo.installHandlers(server, {prefix:'/echo'});
// app.use("/css", express.static(__dirname + '/client/css'));
// app.use("/js", express.static(__dirname + '/client/js'));
app.use('/', express.static(clientDirectory));
// app.get('/', (req, res) => {
// 	res.send('Hallo Node.js!!');
// });

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

server.listen(3000, () => {
	console.log('Server listen on port 3000.');
});


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