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
var countTrueConBoxes;
var colors = ["red", "blue", "green", "yellow", "cyan", "coral", "grey"];
var sockjs;
var sockjs_url;
var ipString;
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

$(init);
function init(){
    app.initialize();
    (new forInitFuncs).layout();
    (new forInitFuncs).clickButtons();
    (new forInitFuncs).buttonPressedFunc();
    (new forInitFuncs).swipeUpDownFunc();
    $("#form").validate({
        rules: {
            "name": {
                required: true,
                minlength: 5
            },
            "date": {
                required: true,
                date: true
            }
        },
        messages: {
            "name": {
                required: "Bitte gib einen Namen ein"
            },
            "date": {
                required: "Bitte gib dein Geburtstag ein",
                email: "Tag ist ungültig"
            }
        },
        submitHandler: function (form) { // for demo
            $("#form").hide();
            $("#editMirrorWindow").show();
            $("#contextBoxPanel").show();
            sendFuncToIndexConn({"function":"addComplimentBox", "arguments":{"name":$("#name").val().toString(),"date":$("#date").val()}});

            alert('Klappt'); // for demo
            return false; // for demo
        }
    });
}

/**
 * Funktionen für den Init
 */
function forInitFuncs(){
    this.layout = function(){
        $("#ipConnectWindow").show();
        $(".contextBoxOptionsPanel").hide();
        $("#editMirrorWindow").hide();
        $("#contextBoxEditPanel").hide();
        $("#form").hide();
    }
    this.clickButtons = function(){
        //registriert die IP, die im Eingabefeld eingegeben wurde
        $("#okIp").click(function() {
            ipString =  $("#myInputField").val().toString();
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
        $("#addComplimentsBox").click(function() {
            $(".contextBoxOptionsPanel").hide();
            $("#editMirrorWindow").hide();
            $("#form").show();
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
    }
    //wenn man auf einer der farblichen Buttons drückt, kann man die entsprechende Contextbox im SmartMirror ändern
    this.buttonPressedFunc = function(){
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
    }
    //aktiviert die Möglichkeit, bei einem Element ein Swipe ausführen zu können, der erkannt wird
    this.swipeUpDownFunc = function(){
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
    }
}

/**
 * Funktionen, die die Verbindung zum Server nutzen
 */
//stellt Verbindung zum Server her
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

    sockjs.onclose = function(e)  {}
}
//öffnet beim Smart Mirror den Edit Modus
function editServerSmartMirror(){
    sendFuncToIndexConn({'function':'indexEditMode'});
    $("#ipConnectWindow").hide();
    $("#editMirrorWindow").show();
}
//zeigt auf dem Smartphone die editierbaren ContentBoxes an
function refreshSmallConBoxes(number) {
    addSmallConBoxes(number,addFuncsToSmallConBoxes);
    function addSmallConBoxes(number, callback) {
        console.log("refreshSmallConBoxes");
        $("#contextBoxEditPanel").hide();
        $("#smallContextBoxPanel").html("");
        for(var i = 0; i<number; i++){
            var element = "<button id=" + ("smallContextBox"+i)+" class='smallContextBox'>T</button>";
            // $(element).css({"border-color": colors[i], "border-style": "solid"});
            $("#smallContextBoxPanel").append(element);
            $('#smallContextBox'+i).css({"border-color": colors[i], "border-style": "solid"});
        }
        callback();
    };
    function addFuncsToSmallConBoxes(){
        $(".smallContextBox").click(function() {
            $("#contextBoxEditPanel").show();
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
}

//allgemeine Funktion, mit der man die Funktion zum Smart Mirror sendet
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

//nützliche Funktion, um sicher JSON.parse anzuwenden
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
