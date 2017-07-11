/**
 * Created by Linh Do on 04.07.2017.
 */

/**
 * Funktionen, die die Verbindung zum Server nutzen
 */

var mainAppWithServerCommunication = makeMainAppWithServerCommunication();
function makeMainAppWithServerCommunication() {
    var sockjs;
    var sockjs_url;
    var ipString;

    //stellt Verbindung zum Server her
    function connectToServer(ipString, callback) {
        sockjs_url = 'http://' + ipString + ':3000/echo';
        sockjs = new SockJS(sockjs_url);
        sockjs.onopen = function () {
            console.log('open client mobile');

            //schickt Server die Daten zur Verbindung mit dem Client Mobile
            messageobj = {'messagetype': 'newConn', 'connName': 'MobileConn'};
            message = JSON.stringify(messageobj);
            sockjs.send(message);
            callback();
        }

        sockjs.onmessage = function (e) {
            console.log(e.data);
            var messageobj = safelyParseJSON(e.data);
            if (messageobj != undefined) {
                if (messageobj.function === 'getCountTrueConBoxes') {
                    editMirrorWindow.refreshSmallConBoxes(messageobj.arguments.countTrueConBoxes);
                }
            }
        };

        sockjs.onclose = function (e) {
        }
    }

    //öffnet beim Smart Mirror den Edit Modus
    function editServerSmartMirror() {
        sendFuncToIndexConn({'function': 'indexEditMode'});
        $("#ipConnectWindow").hide();
        $("#editMirrorWindow").show();
    }

    //allgemeine Funktion, mit der man die Funktion zum Smart Mirror sendet
    function sendFuncToIndexConn(funcObj) {
        sockjs = new SockJS(sockjs_url);
        sockjs.onopen = function () {
            //kommentar
            var messageobj = {'messagetype': 'messageToConn', 'toConn': 'IndexConn'};
            jQuery.extend(messageobj, funcObj);
            var message = JSON.stringify(messageobj);
            sockjs.send(message);
            sockjs.close();
        }
    }

    //nützliche Funktion, um sicher JSON.parse anzuwenden
    function safelyParseJSON(json) {
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

    return {
        connectToServer: function (ipString, callback) {
            return connectToServer(ipString, callback);
        }
        , editServerSmartMirror: function () {
            return editServerSmartMirror();
        }
        , sendFuncToIndexConn: function (funcObj) {
            return sendFuncToIndexConn(funcObj);
        }
    }
}