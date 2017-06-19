/**
 * Created by Linh Do on 25.05.2017.
 */

var aC_ButtonIndex = 0;
var colors = ["red", "blue", "green", "yellow", "cyan", "coral", "grey"];
var boxActivated = [];
var activeBoxes = [];
var conBonIndex;
var sockjs_url;
var sockjs;

$( init );
function init() {
    resetServerConnections(connectToServer);
    $("#addContentButton").click(function() {
        $(".dropdownBoxOptions").toggle();
    });
    $("#addCalendarBox").click(function() {
        addCalendarBox();
    });
    $("#addWatchBox").click(function() {
        addWatchBox();
    });
    $("#addWeatherBox").click(function() {
        addWeatherBox();
    });
    $("#addContentButton").draggable({cancel:false});
    $(".dropdownBoxOptions").hide();
}

/**
 * Funktionen, die die Verbindung zum Server nutzen
 */
//lösche alle bestehenden Verbindungen, die sich der Server bis dahin gemerkt hat
function resetServerConnections(callback) {
    sockjs_url = '/echo';
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        console.log('open client connectToServer');
        console.log('resetConnections');
        // sockjs.send('resetConnections');

        //lösche alle bisher gespeicherten Verbindungen
        messageobj = {'messagetype': 'resetConnections'};
        message = JSON.stringify(messageobj);
        sockjs.send(message);
        sockjs.close();
        callback();
    }

}
function connectToServer(){
    sockjs = new SockJS(sockjs_url);

    //schickt Server die Daten zur Verbindung mit dem Client SmartMirror
    sockjs.onopen = function() {
        messageobj = {'messagetype': 'newConn','connName':'IndexConn'};
        message = JSON.stringify(messageobj);
        sockjs.send(message);
    };

    sockjs.onmessage = function(e)  {
        //prüfe, ob vom Server wirklich eine message gesendet wurde, die die Kalenderevents beinhaltet
        console.log("IndexConn:" + e.data);
        //div.scrollTop(div.scrollTop()+10000);
        if(e.data == "indexEditMode"){
            indexEditMode();
        }
        if(e.data == "addWatchBox"){
            console.log("addWatchBox");
            addWatchBox();
        }
        if(e.data == "addCalendarBox"){
            console.log("addCalendarBox");
            addCalendarBox();
        }
        if(e.data == "addWeatherBox"){
            console.log("addWeatherBox");
            addWeatherBox();
        }
        if(e.data == "deleteContentBox"){
            console.log("deleteContentBox");
            deleteContentBox();
        }
        if(e.data == "upButton"){
            upButton();
        }
        if(e.data == "rightButton"){
            rightButton();
        }
        if(e.data == "downButton"){
            downButton();
        }
        if(e.data == "leftButton"){
            leftButton();
        }
        if(e.data == "closeButton"){
            closeEditMode();
        }
        var messageobj = safelyParseJSON(e.data);
        if (messageobj != undefined) {
            if (messageobj.function === 'changeConBoxWithIndex') {
                conBonIndex = messageobj.arguments.conBonIndex;
                var oldConBonIndex = messageobj.arguments.oldConBonIndex;
                activeBoxes[oldConBonIndex].css({"border-style": "solid"});
                activeBoxes[conBonIndex].css({"border-style": "dotted"});
            }
            if (messageobj.function === 'addComplimentBox') {
                console.log("addcomp");
                addComplimentBox(messageobj.arguments.name, messageobj.arguments.date);
            }
        }
    };

    sockjs.onclose = function() {
        console.log('close');
    };
}
//allgemeine Funktion, mit der man die Funktion zum mobilen Clienten sendet
function sendFuncToMobileConn(funcObj) {
    sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        //kommentar
        var messageobj = {'messagetype': 'messageToConn', 'toConn': 'MobileConn'};
        jQuery.extend(messageobj, funcObj);
        var message = JSON.stringify(messageobj);
        sockjs.send(message);
        sockjs.close();
    }
}

/**
 * Funktionen, die eine ContentBox hinzufügen
 */
function addContentBox() {
    $("#contentBoxPanel").append("<div id=" + ("contentBox"+aC_ButtonIndex)+" class='contentBox'></div>");
    $(".contentBox").draggable();
    boxActivated.push(true);
    $(".dropdownBoxOptions").hide();
    indexEditMode();
    aC_ButtonIndex++;
}
function addWatchBox() {
    addContentBox();
    $("#contentBox"+(aC_ButtonIndex-1)).addClass('watchBox');
    addTime(aC_ButtonIndex-1);

    function addTime(aC_ButtonIndex){
        startTime(aC_ButtonIndex);
        function startTime() {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            m = checkTime(m);
            s = checkTime(s);
            var y = today.getFullYear();
            var mo = today.getMonth()+1;
            var t = today.getDate();

            var weekday = new Array(7);
            weekday[0] = "Sonntag";
            weekday[1] = "Montag";
            weekday[2] = "Dienstag";
            weekday[3] = "Mittwoch";
            weekday[4] = "Donnerstag";
            weekday[5] = "Freitag";
            weekday[6] = "Samstag";

            var n = weekday[today.getDay()];

            $('#contentBox'+aC_ButtonIndex).html(h + ":" + m + ":" + s + '</Br>' + n + '</Br>' + t + "." + mo + "." + y);
            // document.getElementById('contentBox'+aC_ButtonIndex).innerHTML =
            //     h + ":" + m + ":" + s + '</Br>' + n + '</Br>' + t + "." + mo + "." + y;
            var t = setTimeout(startTime, 500);
        }
        function checkTime(i) {
            if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
            return i;
        }
    }
}
function addComplimentBox(name, datum) {
    console.log("addComplimentBox")
    addContentBox();
    $("#contentBox"+(aC_ButtonIndex-1)).addClass('complimentBox');
	
	// Datum in Kompliment umwandeln
	var compliment;
	if (datum > 2000){
		compliment = "Du siehst gut aus heute!";
	}
	if (datum <= 2000 && datum > 1990){
		compliment = "Dein Lächeln ist bezaubernd!";
	}
	else if(datum <= 1990 ){
		compliment = "Deine Frisur steht dir fantastisch!";
	}
	
    var div = $("#contentBox"+(aC_ButtonIndex-1));
    div.append($("<code>").text(name));
    div.append($("<br>"));
    div.append($("<code>").text(compliment));
}
function addCalendarBox() {
    addContentBox();
    $("#contentBox"+(aC_ButtonIndex-1)).addClass('calendarBox');
    addCalEvents(aC_ButtonIndex-1);

    function addCalEvents(aC_ButtonIndex){
        var sockjs_url = '/echo';
        var sockjs = new SockJS(sockjs_url);
        sockjs.onopen = function() {
            messageobj = {'messagetype': 'getCalEvents'};
            message = JSON.stringify(messageobj);
            sockjs.send(message);
        };

        sockjs.onmessage = function(e)  {
            //prüfe, ob vom Server wirklich eine message gesendet wurde, die die Kalenderevents beinhaltet
            if(JSON.parse(e.data)[0]=="getCalInfos") {
                var calendarEvents = JSON.parse(e.data);
                var div = $("#contentBox"+aC_ButtonIndex);
                //entfernt den bisherigen Text des div Elements
                div.contents().filter(function () {
                    return this.nodeType === 3; // Text nodes only
                }).remove();
                //Kalender Events in die div auflisten lassen
                for (var i = 1; i < calendarEvents.length; i++) {
                    var event = calendarEvents[i];
                    if(event[10]=='T'){
                        //formatiere datum, uhrzeit, eventname
                        event = event.substring(0,10) + ' ' + event.substring(11,19) + event.substring(25,event.length);
                    }
                    div.append($("<code>").text(event));
                    div.append($("<br>"));
                }
            }
            //div.scrollTop(div.scrollTop()+10000);
            sockjs.close();
        };

        sockjs.onclose = function() {
        };
    }
}
function addWeatherBox() {
    addContentBox();
    $("#contentBox"+(aC_ButtonIndex-1)).addClass('weatherBox');
    addWeather((aC_ButtonIndex-1));

    var myVar = setInterval(addWeather, 3000);
    function addWeather(index){

        var div = $("#contentBox"+index);

        //fehleranfällig, das async=false gesetzt wird, synchron funktioniert aber alles viel langsamer
        // function getJSON(yourUrl) {
        //     var Httpreq = new XMLHttpRequest(); // a new request
        //         Httpreq.open("GET",yourUrl,false);
        //         Httpreq.send(null);
        //     return Httpreq.responseText;
        // }
        var city = "Hamburg"
        var source = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&lang" +"&appid=";
        var lang = "de"
        var appId = "8a33c4e62d48218b75a9adcdf31375e8"

        var address = source + appId;

        // var json = JSON.parse(getJSON(address));
        $.getJSON(address,function(json){
            // document.write(JSON.stringify(json));
            var beschr = json.weather[0].description;
            var tempCels = json.main.temp - 273.15; //Default in Kelvin - Umrechnung in Celsius
            tempCels = tempCels.toFixed(1);			//Beschränkung von einer Nachkommastelle
            var icohtml = '<img src=' + '\"' + 'http://openweathermap.org/img/w/' + json.weather[0].icon + '.png"' + 'height="100" width="100"' + '>';
            var icon = json.weather[0].icon;
            icon = icon.replace("\"","");
            var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

            div.append($("<code>").text(city));
            div.append($("<br>"));
            div.append($("<code>").text(tempCels + "°"));
            div.append($(icohtml));
            div.append($("<br>"));
            div.append($("<code>").text(beschr));
            div.append($("<br>"));
        });

        // document.getElementById('contentBox'+aC_ButtonIndex).innerHTML =
        // city + '<br/>' + tempCels + "°" +  icohtml + '<br/>' + beschr + '<br/>';

        //console.log(json)
    }
}

/**
 * Funktionen, die die ausgewählte ContentBox verändern
 */
//der EditMode ist dadurch sichtbar, das um die ContentBoxen farbliche Ränder sind
function indexEditMode() {
    var colorIndex = 0;
    var countTrueConBoxes = 0;
    putBorderConBoxes(sendCountTrueConBoxesToServer);

    function putBorderConBoxes(callback){
        activeBoxes = [];
        $('.contentBox').each(function(conBoxIndex) {
            if (boxActivated[conBoxIndex]==true) {
                $(this).css({"border-color": colors[colorIndex], "border-style": "solid"});
                countTrueConBoxes++;
                activeBoxes.push($(this));
            }
            colorIndex++;
        });
        callback();
    }

    function sendCountTrueConBoxesToServer(){
        sendFuncToMobileConn({
            'function':'getCountTrueConBoxes',
            'arguments':{'countTrueConBoxes':countTrueConBoxes}});
    }
}
function upButton() {
    var position = activeBoxes[conBonIndex].offset();
    activeBoxes[conBonIndex].css({"position":"absolute", "top": position.top- $(document).scrollTop()-5});
}
function rightButton() {
    var position = activeBoxes[conBonIndex].offset();
    activeBoxes[conBonIndex].css({"position":"absolute", "left": position.left- $(document).scrollLeft()+5});
}
function downButton() {
    var position = activeBoxes[conBonIndex].offset();
    activeBoxes[conBonIndex].css({"position":"absolute", "top": position.top- $(document).scrollTop()+5});
}
function leftButton() {
    var position = activeBoxes[conBonIndex].offset();
    activeBoxes[conBonIndex].css({"position":"absolute", "left": position.left- $(document).scrollLeft()-5});
}
function deleteContentBox() {
    activeBoxes[conBonIndex].remove();
    indexEditMode();
}
function closeEditMode() {
    $(activeBoxes).each(function() {
        $(this).css({"border-color": "black", "border-style": "solid"});
    });
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
