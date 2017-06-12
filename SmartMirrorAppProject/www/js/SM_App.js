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
$(".contextBoxPanel").hide();
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

$("#test").click(function() {
    console.log("TEST");
    $("#test").append($("<code>").text("blub"));
    testIndexChange();
});

$("#okIp").click(function() {
    console.log("OKIP");
    var ipString =  $("#myInputField").val().toString();
    $("#okIp").append($("<code>").text(ipString));
    editServerSmartMirror(ipString);
});

$("#addWatchBox").click(function() {
    console.log("addWatch");
    $(".contextBoxPanel").toggle();
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        var messageobj = {'messagetype': 'messageToConn', 'toConn': 'IndexConn', 'function':'addWatchBox'};
        var message = JSON.stringify(messageobj);
        sockjs.send(message);
        // console.log( "sm app sockjs onopen"+sockjs);
    };
});

$("#addCalendarBox").click(function() {
    console.log("addWatch");
    $(".contextBoxPanel").toggle();
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        var messageobj = {'messagetype': 'messageToConn', 'toConn': 'IndexConn', 'function':'addCalendarBox'};
        var message = JSON.stringify(messageobj);
        sockjs.send(message);
        // console.log( "sm app sockjs onopen"+sockjs);
    };
});

$("#addWeatherBox").click(function() {
    console.log("addWeatherBox");
    $(".contextBoxPanel").toggle();
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        var messageobj = {'messagetype': 'messageToConn', 'toConn': 'IndexConn', 'function':'addWeatherBox'};
        var message = JSON.stringify(messageobj);
        sockjs.send(message);
        // console.log( "sm app sockjs onopen"+sockjs);
    };
});

$(".addContentBox").click(function() {
    $(".contextBoxPanel").toggle();
});

function editServerSmartMirror(ipString){
    sockjs_url = 'http://'+ipString+':3000/echo';
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        console.log('open client mobile');
        var messageobj = {'messagetype': 'messageToConn', 'toConn': 'IndexConn', 'function':'indexEditMode'};
        var message = JSON.stringify(messageobj);
        console.log(message);
        sockjs.send(message);
        // console.log( "sm app sockjs onopen"+sockjs);
    };
    $("#ipConnectWindow").hide();
    $("#editMirrorWindow").show();
}

function testIndexChange(){
    // var sockjs_url = '/echo';
    // var sockjs = new SockJS(sockjs_url);
    var sockjs = new SockJS('http://192.168.0.72:3000/echo');

    sockjs.onopen = function() {
        console.log('open client mobile');
        sockjs.send('ToConn: Hallo');
        // console.log( "sm app sockjs onopen"+sockjs);
    };

    sockjs.onmessage = function(e) {
        // sockjs.close();
    };

    // sockjs.onclose = function() {
    //     console.log('close');
    // };

}