/**
 * Created by Linh Do on 25.05.2017.
 */

var aC_ButtonIndex = 0;
$("#addContentBox").draggable({cancel:false});
$(".dropdownBoxOptions").hide();


$("#addContentBox").click(function() {
    $(".dropdownBoxOptions").toggle();
});

$("#addCalendarBox").click(function() {
    $("#contentBoxPanel").append("<div id=" + ("contentBox"+aC_ButtonIndex)+" class='contentBox'> test</div>");
    $(".contentBox").draggable();
    addCalEvents(aC_ButtonIndex);
    aC_ButtonIndex++;
    $(".dropdownBoxOptions").toggle();
});


function addCalEvents(aC_ButtonIndex){
    var sockjs_url = '/echo';
    var sockjs = new SockJS(sockjs_url);
    sockjs.onopen = function() {
        console.log('open client');
        sockjs.send('getCalEvents');
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
        console.log('close');
    };
}



/* When the user clicks on the button,
 toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}