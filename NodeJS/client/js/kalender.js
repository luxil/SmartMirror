/**
 * Created by Linh Do on 25.05.2017.
 */

$( init );
function init() {
    $("#header").load("header.html");
    // $('#makeMeDraggable').draggable();
    $('.contentBox').draggable();
    addCalEvents();
}

function addCalEvents(){
    var sockjs_url = '/echo';
    var sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        console.log('open client');
        sockjs.send('getCalEvents');
    };

    sockjs.onmessage = function(e) {
        //prüfe, ob vom Server wirklich eine message gesendet wurde, die die Kalenderevents beinhaltet
        if(JSON.parse(e.data)[0]=="getCalInfos") {
            var calendarEvents = JSON.parse(e.data);
            var div = $('#calendarBox');
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
        console.log('close');
    };
}
// // $('#first input').focus();
// var div  = $('#calendarBox');
// div.append($("<code>").text(' hallo'));
