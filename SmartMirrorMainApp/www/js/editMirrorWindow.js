/**
 * Created by Linh Do on 11.07.2017.
 */

var editMirrorWindow  = makeEditMirrorWindow();

    function makeEditMirrorWindow() {
    var oldSmallButIndex = 0;
    var countTrueConBoxes;
    var colors = ["red", "blue", "green", "yellow", "cyan", "coral", "grey", "brown"];
    var app;

    function init(app) {
        this.app = app;
        $("#addComplimentsBox").click(function() {
            formWindow.showFormElement();
        });
        //wenn einer der möglichen Optionen (z.B. Wetter) geklickt wurde, dieses Fenster im Smart Mirror hinzufügen
        $(".contentBoxPanelOptionsBut").click(function() {
            //$(this).get(0).id kann zum Beispiel addWatchbox, addCalendarBox usw. sein
            var addContentBox = $(this).get(0).id;
            $(".contextBoxOptionsPanel").toggle();
            $("#contextBoxPanel").toggle();
            mainAppWithServerCommunication.sendFuncToIndexConn({'function':addContentBox});
        });
        //zeigt die möglichen Optionen (z.B. Wetter), die man zum SmartMirror hinzufügen kann
        $(".addContentButton").click(function() {
            if(countTrueConBoxes>7){
                alert("Mehr als 8 Boxen können nicht hinzugefügt werden!")
            }else {
                $(".contextBoxOptionsPanel").toggle();
                $("#contextBoxPanel").toggle();
            }
        });

        $("#deleteButton").click(function() {
            mainAppWithServerCommunication.sendFuncToIndexConn({'function':'deleteContentBox'})
        });
        $("#closeButton").click(function() {
            mainAppWithServerCommunication.sendFuncToIndexConn({'function':'closeButton'});
            ipConnectWindow.showIpConnectElement();
            navigator.app.exitApp();

        });

        //rufe die Buttonfunktionen auf
        buttonPressedFunc();
        swipeUpDownFunc();
    }

    function showEditMirrorElement() {

    }

    //zeigt auf dem Smartphone die editierbaren ContentBoxes an
    function refreshSmallConBoxes(number) {
        countTrueConBoxes = number;
        addSmallConBoxes(number, addFuncsToSmallConBoxes);
        function addSmallConBoxes(number, callback) {
            console.log("refreshSmallConBoxes");
            $("#contextBoxEditPanel").hide();
            $("#smallContextBoxPanel").html("");
            for (var i = 0; i < number; i++) {
                var element = "<button id=" + ("smallContextBox" + i) + " class='smallContextBox'>O</button>";
                $("#smallContextBoxPanel").append(element);
                $('#smallContextBox' + i).css({"border-color": colors[i], "border-style": "solid"});
            }
            callback();
        };
        function addFuncsToSmallConBoxes() {
            $(".smallContextBox").click(function () {
                $("#contextBoxEditPanel").toggle();
                $('#smallContextBox' + oldSmallButIndex).css({"border-style": "solid"});
                var smallContentBox = $(this).get(0).id;
                var number = smallContentBox[15];

                if($("#contextBoxEditPanel").is(":visible")){
                    $(this).css({"border-style": "dashed"});
                } else{
                    $(this).css({"border-style": "solid"});
                }
                mainAppWithServerCommunication.sendFuncToIndexConn({
                    'function': 'changeConBoxWithIndex',
                    'arguments': {'conBonIndex': number, 'oldConBonIndex': oldSmallButIndex}
                });
                oldSmallButIndex = number;
            });
        }
    }
    //beim Gedrückhalten der Pfeiltaste dem Server dem Befehl geben, dass die Contentbox verschoben werden soll
    function buttonPressedFunc(){
        var interval;
        $('.moveButton').on('taphold',function(e) {
            var moveButton = $(this).get(0).id;
            interval = setInterval(function() {
                mainAppWithServerCommunication.sendFuncToIndexConn({'function':moveButton});
            },100); // 500ms between each frame
        });
        $('.moveButton').on('touchend',function(e) {//mouseup equiv.
            clearInterval(interval);
        });
        $('.moveButton').on('touchleave',function(e) {//mouseout equiv.
            clearInterval(interval);
        });
    }
    //aktiviert die Möglichkeit, bei einem Element ein Swipe ausführen zu können, der erkannt wird
    function swipeUpDownFunc(){
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

    return {
        refreshSmallConBoxes: function (number) {
            return refreshSmallConBoxes(number);
        }
        , init: function () {
            return init();
        }, showEditMirrorElement: function () {
            return showEditMirrorElement();
        }
    }
}