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
        console.log('message', e.data);
        //prüfe, ob vom Server wirklich eine message gesendet wurde, die die Kalenderevents beinhaltet
        if(JSON.parse(e.data)[0]=="getCalInfos") {
            //console.log('message', typeof (JSON.parse(e.data)[0]));
            console.log('message e.data0'+ JSON.parse(e.data)[0]);
            var calendarEvents = JSON.parse(e.data);
            var div = $('#calendarBox');
            //entfernt den bisherigen Text des div Elements
            div.contents().filter(function () {
                return this.nodeType === 3; // Text nodes only
            }).remove();
            for (var i = 1; i < calendarEvents.length; i++) {
                div.append($("<code>").text(calendarEvents[i]));
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
