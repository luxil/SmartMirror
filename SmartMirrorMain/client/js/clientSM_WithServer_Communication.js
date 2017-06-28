/**
 * Created by Linh Do on 25.05.2017.
 */
/**
 * In dieser Datei findet die Kommunkation des Clienten mit dem Server statt
 */

var clientSM_WithServer_Communication = makeClientSM_WithServer_Communication();
function makeClientSM_WithServer_Communication() {
    var sockjs_url;
    var sockjs;

    //lösche alle bestehenden Verbindungen, die sich der Server bis dahin gemerkt hat
    function resetServerConnections(callback) {
        sockjs_url = '/echo';
        sockjs = new SockJS(sockjs_url);
        sockjs.onopen = function() {
            console.log('open client communicationWithServer');
            console.log('resetConnections');

            //lösche alle bisher gespeicherten Verbindungen
            messageobj = {'messagetype': 'resetConnections'};
            message = JSON.stringify(messageobj);
            sockjs.send(message);
            sockjs.close();
            callback();
        }

    }
    //verwaltet die Kommunikation des Clienten Smart Mirror mit dem Server
    function communicationWithServer(){
        sockjs = new SockJS(sockjs_url);

        //schickt Server die Daten zur Verbindung mit dem Client SmartMirror
        sockjs.onopen = function() {
            messageobj = {'messagetype': 'newConn','connName':'IndexConn'};
            message = JSON.stringify(messageobj);
            sockjs.send(message);
        };

        //hier verwertet der SmartMirror die Messages, die er bekommen hat
        sockjs.onmessage = function(e)  {
            console.log("IndexConn:" + e.data);
            //div.scrollTop(div.scrollTop()+10000);
            if(e.data == "indexEditMode")       contentBoxManager.indexEditMode();
            if(e.data == "closeButton")         contentBoxManager.closeEditMode();
            if(e.data == "addWatchBox")         conBoxTypes.addWatchBox();
            if(e.data == "addCalendarBox")      conBoxTypes.addCalendarBox();
            if(e.data == "addWeatherBox")       conBoxTypes.addWeatherBox();
            if(e.data == "deleteContentBox")    changeBoxFunctions.deleteContentBox();
            if(e.data == "upButton")            changeBoxFunctions.upButton();
            if(e.data == "rightButton")         changeBoxFunctions.rightButton();
            if(e.data == "downButton")          changeBoxFunctions.downButton();
            if(e.data == "leftButton")          changeBoxFunctions.leftButton();
            var messageobj = safelyParseJSON(e.data);
            /**
             * hier sind die Funktionen, die auch Argumente übertragen bekommen haben,
             * deswegen müssen diese extra nochmal geparset werden
             */
            if (messageobj != undefined) {
                if (messageobj.function === 'changeConBoxWithIndex')    changeBoxFunctions.changeConBoxWithIndex(messageobj);
                if (messageobj.function === 'addComplimentBox')         conBoxTypes.addComplimentBox(messageobj.arguments.name, messageobj.arguments.date);
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
    return{
        resetServerConnections:function (callback) {
            return resetServerConnections(callback)
        }
        , communicationWithServer:function () {
            return communicationWithServer()
        }
        , sendFuncToMobileConn:function (funcObj) {
            return sendFuncToMobileConn(funcObj)
        }
    }

}