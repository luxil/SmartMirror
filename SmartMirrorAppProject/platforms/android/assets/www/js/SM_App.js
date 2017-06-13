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

var oldSmallButIndex = 0;
// var oldSmallButIndex = 0;
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

$("#ipConnectWindow").show();
$(".contextBoxOptionsPanel").hide();
$("#editMirrorWindow").hide();
//registriert die IP, die im Eingabefeld eingegeben wurde
$("#okIp").click(function() {
    var ipString =  $("#myInputField").val().toString();
    $("#okIp").append($("<code>").text(ipString));
    connectToServer(ipString, editServerSmartMirror)
});
$("#deleteButton").click(function() {
    sendFuncToIndexConn({'function':'deleteContentBox'})
});
$("#closeButton").click(function() {
    sendFuncToIndexConn({'function':'closeButton'});
    navigator.app.exitApp();
});
//wenn einer der möglichen Optionen (z.B. Wetter) geklickt wurde, dieses Fenster im Smart Mirror hinzufügen
$(".contentBoxPanelOptionsBut").click(function() {
    //$(this).get(0).id kann zum Beispiel addWatchbox, addCalendarBox usw. sein
    var addContentBox = $(this).get(0).id;
    // console.log(addContentBox);
    $(".contextBoxOptionsPanel").toggle();
    $("#contextBoxPanel").toggle();
    sendFuncToIndexConn({'function':addContentBox});
});
//zeigt die möglichen Optionen (z.B. Wetter), die man zum SmartMirror hinzufügen kann
$(".addContentButton").click(function() {
    if(countTrueConBoxes>8){
        alert("Mehr als 8 Boxen können nicht hinzugefügt werden!")
    }else {
        $(".contextBoxOptionsPanel").toggle();
        $("#contextBoxPanel").toggle();
    }
});
//wenn man auf einer der farblichen Buttons drückt, kann man den entsprechenden Contextbox im SmartMirror ändern

var interval;
$('.moveButton').on('taphold',function(e) {
    var moveButton = $(this).get(0).id;
    interval = setInterval(function() {
        sendFuncToIndexConn({'function':moveButton});
    },100); // 500ms between each frame
});
$('.moveButton').on('mouseup',function(e) {
    clearInterval(interval);
});
// Thank you, Timo002, for your contribution!
// This code will stop the interval if you move your mouse away from the button while still holding it.
$('.moveButton').on('mouseout',function(e) {
    clearInterval(interval);
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

    sockjs.onmessage = function(e)  {
        console.log(e.data);
        var messageobj = safelyParseJSON(e.data);
        if (messageobj != undefined) {
            if (messageobj.function === 'getCountTrueConBoxes') {
                countTrueConBoxes = messageobj.arguments.countTrueConBoxes;
                console.log("countTrueConBoxes: " + countTrueConBoxes);
                refreshSmallConBoxes(countTrueConBoxes, addFuncsToSmallConBoxes);
            }
        }
    };

    sockjs.onclose = function(e)  {
        sockjs.send("jo");
        console.log("SM client close conn")
    }
}

function editServerSmartMirror(){
    sendFuncToIndexConn({'function':'indexEditMode'});
    $("#ipConnectWindow").hide();
    $("#editMirrorWindow").show();
}

function refreshSmallConBoxes(number, callback) {
    console.log("refreshSmallConBoxes")
    $("#smallContextBoxPanel").html("");
    for(var i = 0; i<number; i++){
        var element = "<button id=" + ("smallContextBox"+i)+" class='smallContextBox'>T</button>";
        // $(element).css({"border-color": colors[i], "border-style": "solid"});
        $("#smallContextBoxPanel").append(element);
        $('#smallContextBox'+i).css({"border-color": colors[i], "border-style": "solid"});
    }
    callback();
}

function addFuncsToSmallConBoxes(){
    $(".smallContextBox").click(function() {
        $('#smallContextBox'+oldSmallButIndex).css({"border-style": "solid"});
        $(this).css({"border-style": "dotted"});
        var smallContentBox = $(this).get(0).id;
        var number = smallContentBox[15];

        sendFuncToIndexConn({
            'function': 'changeConBoxWithIndex',
            'arguments': {'conBonIndex': number, 'oldConBonIndex': oldSmallButIndex}});
        oldSmallButIndex = number;
    });
}

function sendFuncToIndexConn(funcObj) {
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        //kommentar
        var messageobj = {'messagetype': 'messageToConn', 'toConn': 'IndexConn'};
        jQuery.extend(messageobj, funcObj);
        var message = JSON.stringify(messageobj);
        sockjs.send(message);
        sockjs.close();
    }
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

var supportTouch = $.support.touch,
    scrollEvent = "touchmove scroll",
    touchStartEvent = supportTouch ? "touchstart" : "mousedown",
    touchStopEvent = supportTouch ? "touchend" : "mouseup",
    touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
$.event.special.swipeupdown = {
    setup: function() {
        var thisObject = this;
        var $this = $(thisObject);
        $this.bind(touchStartEvent, function(event) {
            var data = event.originalEvent.touches ?
                    event.originalEvent.touches[ 0 ] :
                    event,
                start = {
                    time: (new Date).getTime(),
                    coords: [ data.pageX, data.pageY ],
                    origin: $(event.target)
                },
                stop;

            function moveHandler(event) {
                if (!start) {
                    return;
                }
                var data = event.originalEvent.touches ?
                    event.originalEvent.touches[ 0 ] :
                    event;
                stop = {
                    time: (new Date).getTime(),
                    coords: [ data.pageX, data.pageY ]
                };

                // prevent scrolling
                if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                    event.preventDefault();
                }
            }
            $this
                .bind(touchMoveEvent, moveHandler)
                .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                            Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                            Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                .trigger("swipeupdown")
                                .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
        });
    }
};
$.each({
    swipedown: "swipeupdown",
    swipeup: "swipeupdown"
}, function(event, sourceEvent){
    $.event.special[event] = {
        setup: function(){
            $(this).bind(sourceEvent, $.noop);
        }
    };
});
$("#upButton").on('swipeup',function(){alert("swipeup..");} );