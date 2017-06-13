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

var oldSmallButIndex = 0;
var countTrueConBoxes;
var colors = ["red", "blue", "green", "yellow", "cyan", "coral", "grey"];
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

//registriert die IP, die im Eingabefeld eingegeben wurde
$("#okIp").click(function() {
    var ipString =  $("#myInputField").val().toString();
    $("#okIp").append($("<code>").text(ipString));
    connectToServer(ipString, editServerSmartMirror)
});
//wenn einer der möglichen Optionen (z.B. Wetter) geklickt wurde, dieses Fenster im Smart Mirror hinzufügen
$(".contentBoxPanelOptionsBut").click(function() {
    //$(this).get(0).id kann zum Beispiel addWatchbox, addCalendarBox usw. sein
    var addContentBox = $(this).get(0).id;
    // console.log(addContentBox);
    $(".contextBoxOptionsPanel").toggle();
    $("#contextBoxPanel").toggle();
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        var messageobj = {'messagetype': 'messageToConn', 'toConn': 'IndexConn', 'function':addContentBox};
        var message = JSON.stringify(messageobj);
        sockjs.send(message);
    };
});
//zeigt die möglichen Optionen (z.B. Wetter), die man zum SmartMirror hinzufügen kann
$(".addContentButton").click(function() {
    $(".contextBoxOptionsPanel").toggle();
    $("#contextBoxPanel").toggle();
});
//wenn man auf einer der farblichen Buttons drückt, kann man den entsprechenden Contextbox im SmartMirror ändern


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

    sockjs.onmessage = function(e)  {
        console.log(e.data);
        var messageobj = safelyParseJSON(e.data);
        if (messageobj != undefined) {
            if (messageobj.function === 'getCountTrueConBoxes') {
                countTrueConBoxes = messageobj.arguments.countTrueConBoxes;
                console.log("countTrueConBoxes: " + countTrueConBoxes);
                refreshSmallConBoxes(countTrueConBoxes);
            }
        }
    };
}

function editServerSmartMirror(){
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {

        //schickt Server Nachricht, dass der Smart Mirror in den Edit Modus gehen soll
        var messageobj = {'messagetype': 'messageToConn', 'toConn': 'IndexConn', 'function':'indexEditMode'};
        var message = JSON.stringify(messageobj);
        sockjs.send(message);
        sockjs.close();
    };
    $("#ipConnectWindow").hide();
    $("#editMirrorWindow").show();
}

function refreshSmallConBoxes(number) {
    console.log("refreshSmallConBoxes")
    $("#contextBoxPanel").html("");
    for(var i = 0; i<number; i++){
        var element = "<button id=" + ("smallContextBox"+i)+" class='smallContextBox'>T</button>";
        // $(element).css({"border-color": colors[i], "border-style": "solid"});
        $("#contextBoxPanel").append(element);
        $('#smallContextBox'+i).css({"border-color": colors[i], "border-style": "solid"});
    }
    $(".smallContextBox").click(function() {
        $('#smallContextBox'+oldSmallButIndex).css({"border-style": "solid"});
        $(this).css({"border-style": "dotted"});
        var smallContentBox = $(this).get(0).id;
        var number = smallContentBox[15];


        sockjs = new SockJS(sockjs_url);
        sockjs.onopen = function() {
            console.log('send to server connumber: ' + number);
            var messageobj = {
                'messagetype': 'messageToConn',
                'toConn': 'IndexConn',
                'function': 'changeConBoxWithIndex',
                'arguments': {'conBonIndex': number, 'oldConBonIndex': oldSmallButIndex}
            };
            message = JSON.stringify(messageobj);
            oldSmallButIndex = number;
            sockjs.send(message);
        }
    });
}

//useful functions
function safelyParseJSON (json) {
    // This function cannot be optimised, it's best to
    // keep it small!
    var parsed;

    try {
        parsed = JSON.parse(json)
    } catch (e) {
        // Oh well, but whatever...
    }

    return parsed // Could be undefined!
}