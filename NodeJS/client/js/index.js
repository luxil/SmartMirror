/**
 * Created by Linh Do on 25.05.2017.
 */
var sockjs_url = '/echo';
var sockjs = new SockJS(sockjs_url);
$('#first input').focus();
var div  = $('#first div');
var inp  = $('#first input');
var form = $('#first form');
var print = function(m, p) {
    p = (p === undefined) ? '' : JSON.stringify(p);
    div.append($("<code>").text(m + ' ' + p));
    div.append($("<br>"));
    div.scrollTop(div.scrollTop()+10000);
};
sockjs.onopen    = function()  {print('[*] open', sockjs.protocol);};
sockjs.onmessage = function(e) {print('[.] message', e.data);};
sockjs.onclose   = function()  {print('[*] close');};
form.submit(function() {
    print('[ ] sending', inp.val());
    sockjs.send(inp.val());
    inp.val('');
    return false;
});


$( init );
function init() {
    $("#header").load("header.html");
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