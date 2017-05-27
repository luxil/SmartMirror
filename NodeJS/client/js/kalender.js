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
        sockjs.send('test');
    };

    sockjs.onmessage = function(e) {
        console.log('message', e.data);
        var div  = $('#calendarBox');
        div.append($("<code>").text(e.data));
        div.append($("<br>"));
        //div.scrollTop(div.scrollTop()+10000);
        //sockjs.close();
    };

    sockjs.onclose = function() {
        console.log('close');
    };
}
// $('#first input').focus();
var div  = $('#calendarBox');
div.append($("<code>").text(' hallo'));
