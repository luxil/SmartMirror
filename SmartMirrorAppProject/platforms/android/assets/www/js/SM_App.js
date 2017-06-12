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
        // console.log( "sm app onmessage "+e.data);
        // console.log( "sm app sockjs onmessage"+sockjs);
        // //prüfe, ob vom Server wirklich eine message gesendet wurde, die die Kalenderevents beinhaltet
        // if(JSON.parse(e.data)[0]=="getCalInfos") {
        //     var calendarEvents = JSON.parse(e.data);
        //     var div = $('#calendarBox');
        //     //entfernt den bisherigen Text des div Elements
        //     div.contents().filter(function () {
        //         return this.nodeType === 3; // Text nodes only
        //     }).remove();
        //     //Kalender Events in die div auflisten lassen
        //     for (var i = 1; i < calendarEvents.length; i++) {
        //         var event = calendarEvents[i];
        //         if(event[10]=='T'){
        //             //formatiere datum, uhrzeit, eventname
        //             event = event.substring(0,10) + ' ' + event.substring(11,19) + event.substring(25,event.length);
        //         }
        //         div.append($("<code>").text(event));
        //         div.append($("<br>"));
        //     }
        // }
        // //div.scrollTop(div.scrollTop()+10000);
        // sockjs.close();


    };
    // sockjs.onclose = function() {
    //     console.log('close');
    // };



    // var socket = new Socket();
    // socket.open(
    //     "192.168.0.72",
    //     3000,
    //     function() {
    //         // invoked after successful opening of socket
    //     },
    //     function(errorMessage) {
    //         // invoked after unsuccessful opening of socket
    //     }
    // );
    //
    // var dataString = "Hello world";
    // var data = new Uint8Array(dataString.length);
    // for (var i = 0; i < data.length; i++) {
    //     data[i] = dataString.charCodeAt(i);
    // }
    // socket.write(data);
    // socket.shutdownWrite();

}