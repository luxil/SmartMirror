/**
 * Created by Linh Do on 27.06.2017.
 */

//initialisiere den Smart Mirror
$( init );
function init() {
    clientSM_WithServer_Communication.resetServerConnections(clientSM_WithServer_Communication.communicationWithServer);
    //folgende Funktion nur auskommentieren, wenn direkt mit der Maus
    //der Smart Mirror verändert werden soll
    //dafür muss auch in der index.html der dazu gehörige Codeteil auskommentiert werden
    //directSmartMirrorActions();
}

//Function um die direkte Verwaltung am SmartMirror zu ermöglichen,
//dafür muss auch in der index.html der dazu gehörige Codeteil auskommentiert werden
function directSmartMirrorActions() {
    $("#addContentButton").click(function() {
        $(".dropdownBoxOptions").toggle();
    });
    $("#addCalendarBox").click(function() {
        conBoxTypes.addCalendarBox();
    });
    $("#addWatchBox").click(function() {
        conBoxTypes.addWatchBox();
    });
    $("#addWeatherBox").click(function() {
        conBoxTypes.addWeatherBox();
    });
    $("#addContentButton").draggable({cancel:false});
    $(".dropdownBoxOptions").hide();
}