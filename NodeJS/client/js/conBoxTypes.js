/**
 * Created by Linh Do on 27.06.2017.
 */
/**
 * In dieser Datei sind die verschiedenen Typen, die die ContentBox annehmen kann, zB. Uhrzeit oder Komplimente
 */

var conBoxTypes = makeConBoxTypes();

function makeConBoxTypes() {
    //fügt der Box die Informationen Uhrzeit und Datum hinzu
    function addWatchBox() {
        var $contentBox = contentBoxManager.addContentBox();
        $contentBox.addClass('watchBox');
        addTime($contentBox);

        function addTime($contentBox){
            startTime();
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

                $contentBox.html(h + ":" + m + ":" + s + '</Br>' + n + '</Br>' + t + "." + mo + "." + y);
                var t = setTimeout(startTime, 500);
            }
            function checkTime(i) {
                if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
                return i;
            }
        }
    }
    //fügt der Box Komplimente hinzu
    function addComplimentBox(name, datum) {
        console.log("addComplimentBox")
        var $contentBox = contentBoxManager.addContentBox();
        $contentBox.addClass('complimentBox');

        // Tag und Monat aus dem Datum auslesen
        var tag = datum.substr(8,9);
        var monat = datum.substring(5,7);
        var summe = monat+""+ tag;
        var compliment;

        // Sternzeichen
        if (summe >= 321 && summe <= 420){
            compliment = "Nichts ist so überzeugend wie dein Lächeln."; //Widder
        }
        if (summe >= 421 && summe <= 520){
            compliment = "Wrr schön sein will, muss lachen."; //Stier
        }
        if (summe >= 521 && summe <= 621){
            compliment = "Ich wünsche dir einen Tag voll Frieden & Harmonie."; //Zwilling
        }
        if (summe >= 622 && summe <= 722){
            compliment = "Deine Augen sprechen auch, wenn du nichts sagst."; //Krebs
        }
        if (summe >= 723 && summe <= 823){
            compliment = "Es geht nicht um die TO-Do's, sondern um die TADAAS!"; //Löwe
        }
        if (summe >= 824 && summe <= 923){
            compliment = "Geduld zahlt sich aus!"; //Jungfrau
        }
        if (summe >= 924 && summe <= 1023){
            compliment = "Vergleiche dich nicht mit anderen, sei du selbst!"; //Waage
        }
        if (summe >= 1024 && summe <= 1122){
            compliment = "Nimm dir Zeit für die Dinge, die dich glücklich machen"; //Skorpion
        }
        if (summe >= 1123 && summe <= 1221){
            compliment = "Schätze die Person, die du bist!"; //Schütze
        }
        if (summe >= 1222 || summe <= 120){
            compliment = "Denken muss man doch eh. Warum also nicht positiv."; //Steinbock
        }
        if (summe >= 121 && summe <= 219){
            compliment = "Du musst nicht perfekt werden, um fantastisch zu sein!"; //Wassermann
        }
        if (summe >= 220 && summe <= 320){
            compliment = "Dein Alltag läuft so rund wie ein Dreieck!"; //Fische
        }


        var div = $contentBox;
        div.append($("<code>").text(name));
        div.append($("<br>"));
        div.append($("<code>").text(compliment));
    }
    //fügt der Box die Kalenderinformationen hinzu
    function addCalendarBox() {
        var $contentBox = contentBoxManager.addContentBox();
        $contentBox.addClass('calendarBox');
        addCalEvents($contentBox);

        function addCalEvents($contentBox){
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
                    var div = $contentBox;
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
    //fügt der Box die Wetterinfos hinzu
    function addWeatherBox() {
        var $contentBox = contentBoxManager.addContentBox();
        $contentBox.addClass('weatherBox');
        addWeather($contentBox);

        var myVar = setInterval(addWeather, 3000);
        function addWeather($contentBox){

            var div = $contentBox;

            //fehleranfällig, da async=false gesetzt wird, synchron funktioniert aber alles viel langsamer
            //evtl später mal bearbeiten
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

                // Übersetzung der Beschreibung ins deutsche
                if (beschr == "clear sky"){
                    beschr = "Klar";
                }
                if (beschr == "few clouds"){
                    beschr = "Wenige Wolken";
                }
                if (beschr == "scattered clouds"){
                    beschrr = "Vereinzelt Bewölkt";
                }
                if (beschr == "broken clouds"){
                    beschr = "Aufgerissene Bewölkung";
                }
                if (beschr == "shower rain"){
                    beschr = "Regenschauer";
                }
                if (beschr == "rain"){
                    beschr = "Regen";
                }
                if (beschr == "thunderstorm"){
                    beschr = "Gewitter";
                }
                if (beschr == "snow"){
                    beschr = "Schnee";
                }
                if (beschr == "mist"){
                    beschr = "Nebel";
                }
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
        }
    }

    return {
        addWatchBox: function () {
            return addWatchBox();
        }
        , addComplimentBox: function () {
            return addComplimentBox();
        }
        , addCalendarBox: function () {
            return addCalendarBox();
        }
        , addWeatherBox: function () {
            return addWeatherBox();
        }
    }
}