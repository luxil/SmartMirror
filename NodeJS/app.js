/*Dient als Server für sockjs, expressjs und googleapi*/

var http = require('http');
var	path = require('path');
var express = require('express');
var sockjs  = require('sockjs');
var kalender = require('./app_kalender');
var path = require('path')
var clientDirectory= path.join(__dirname, 'client');
var connections = [];

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js"};
var sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', function(conn) {
    conn.on('data',function(message) {
        //console.log("Sending confsignals to CMS", message);
        //conn.write('from server: ' + message);
        console.log("sockjs_echo.on message: " + message);
        console.log("conn: " + conn);
        console.log("sockjs_echo: " + JSON.stringify(sockjs_echo));
        if (message == 'resetConnections') {
            connections = [];
        }
        if (message == 'getCalEvents') {
            kalender.load_events(function () {
                kalender.returnEventInfos(function (test) {
                    var new_array = ["getCalInfos"].concat(JSON.parse(test));
                    //kommentar
                    conn.write(JSON.stringify(new_array));
                    return test;
                });
            });
        }
        if (message == 'testIndexChange') {
            //conn.write("testIndexChange");
        }
        if (message.indexOf('ToConn:')!= -1) {
            console.log(connections.length);
            for (var ii=0; ii < connections.length; ii++) {
                console.log(message.substring(8,message.length));
                if(connections[ii].connName = "IndexConn"){
                    connections[ii].conn.write(message.substring(8,message.length));
                }
                // connections[ii].write("User " + number + " has disconnected");
            }
        }

        if (safelyParseJSON(message) != undefined){
            if (safelyParseJSON(message).messagetype == 'newConn') {
                console.log("New Connection with name " + JSON.parse(message).connName);
                var connection = {conn: conn, connName: JSON.parse(message).connName};
                connections.push(connection);
                console.log("connections:" );
                console.log(connections);
            }
        }


        function safelyParseJSON (json) {
            // This function cannot be optimised, it's best to
            // keep it small!
            var parsed

            try {
                parsed = JSON.parse(json)
            } catch (e) {
                // Oh well, but whatever...
            }

            return parsed // Could be undefined!
        }
    });
});


// 2. Express server
var app = express();
var server = http.createServer(app);
sockjs_echo.installHandlers(server, {prefix:'/echo'});

app.use('/', express.static(clientDirectory));
app.use("/mobile", express.static(path.resolve(__dirname + '/../SmartMirrorAppProject/www')));
app.use("/SmartMirrorAppProject", express.static(path.resolve(__dirname + '/../SmartMirrorAppProject/')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/mobile', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../SmartMirrorAppProject/www/SM_App.html'));
});

server.listen(3000, function() {
	console.log('Server listen on port 3000.');
});