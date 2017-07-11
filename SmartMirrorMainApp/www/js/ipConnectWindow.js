/**
 * Created by Linh Do on 11.07.2017.
 */

var ipConnectWindow = makeIpConnectWindow();

function makeIpConnectWindow(){

    function init(){
        //Ok button registriert die IP, die im Eingabefeld eingegeben wurde
        $("#okIp").click(function() {
            window.scrollTo(0, 0);
            var ipString =  $("#myInputField").val().toString();
            mainAppWithServerCommunication.connectToServer(ipString, mainAppWithServerCommunication.editServerSmartMirror)
        });
    }

    function showIpConnectElement(){
        $("#ipConnectWindow").show();
        $(".contextBoxOptionsPanel").hide();
        $("#editMirrorWindow").hide();
        $("#contextBoxEditPanel").hide();
        $("#form").hide();

        //sorgt dafür, dass im Webbrowser die IP direkt aus der URL ausgelesen wird; funktioniert natürlich nur im Browser
        //$("#myInputField").val(window.location.hostname);
        //
        $("#myInputField").val("169.254.3.142");
    }

    return {
        showIpConnectElement: function () {
            return showIpConnectElement();
        }
        , init: function () {
            return init();
        }
    }
}