/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

$("#ipConnectWindow").show();
$(".contextBoxOptionsPanel").hide();
$("#editMirrorWindow").hide();

var sockjs;
var sockjs_url;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

$("#okIp").click(function() {
    var ipString =  $("#myInputField").val().toString();
    $("#okIp").append($("<code>").text(ipString));
    connectToServer(ipString, editServerSmartMirror)
    // editServerSmartMirror();
});

$(".contentBoxPanelOptionsBut").click(function() {
    //$(this).get(0).id kann zum Beispiel addWatchbox, addCalendarBox usw. sein
    var addContentBox = $(this).get(0).id;
    console.log(addContentBox);
    $(".contextBoxOptionsPanel").toggle();
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        var messageobj = {'messagetype': 'messageToConn', 'toConn': 'IndexConn', 'function':addContentBox};
        var message = JSON.stringify(messageobj);
        sockjs.send(message);
    };
});


$(".addContentButton").click(function() {
    $(".contextBoxOptionsPanel").toggle();
});

function connectToServer(ipString, callback){
    sockjs_url = 'http://'+ipString+':3000/echo';
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        console.log('open client mobile');

        //schickt Server die Daten zur Verbindung mit dem Client Mobile
        messageobj = {'messagetype': 'newConn','connName':'MobileConn'};
        message = JSON.stringify(messageobj);
        sockjs.send(message);
        callback();
    }
}

function editServerSmartMirror(){
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {

        //schickt Server Nachricht, dass der Smart Mirror in den Edit Modus gehen soll
        var messageobj = {'messagetype': 'messageToConn', 'toConn': 'IndexConn', 'function':'indexEditMode'};
        var message = JSON.stringify(messageobj);
        sockjs.send(message);
    };
    $("#ipConnectWindow").hide();
    $("#editMirrorWindow").show();
}