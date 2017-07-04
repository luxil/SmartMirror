/**
 * Created by Linh Do on 27.06.2017.
 */
/**
 * In dieser Datei sind verschiedene Funktionen definiert, um die ContentBoxen zu verwalten
 */

var contentBoxManager = makeContentBoxes();
function makeContentBoxes() {
    var aC_ButtonIndex = 0;
    //Farben der ContentBoxen
    var colors = ["red", "blue", "green", "yellow", "cyan", "coral", "grey"];
    var activeBoxes = [];
    var selConBonIndex;
    var cBoxes = [];

    //Klasse Contentbox, die Index, Sichtbarkeit und den Verweis zum Jquery-Objekt enthält
    function ContentBox(index, visible){
        this.index = index;
        this.visible = visible;
        this.jQRef = $("#contentBox"+(index));
    }

    //fügt ContentBox hinzu
    function addContentBox() {
        $("#contentBoxPanel").append("<div id=" + ("contentBox"+aC_ButtonIndex)+" class='contentBox'></div>");
        $(".contentBox").draggable();
        cBoxes.push(new ContentBox(aC_ButtonIndex, true));
        $(".dropdownBoxOptions").hide();
        indexEditMode();
        aC_ButtonIndex++;
        return cBoxes[aC_ButtonIndex-1].jQRef;
    }

    //der EditMode ist dadurch sichtbar, das um die ContentBoxen farbliche Ränder sind;
    // in diesem Modus kann der Smart Mirror verändert werden
    function indexEditMode() {
        var colorIndex = 0;
        var countTrueConBoxes = 0;
        putBorderConBoxes(sendCountTrueConBoxesToServer);

        function putBorderConBoxes(callback){
            activeBoxes = [];
            $('.contentBox').each(function(index) {
                if (cBoxes[index].visible===true) {
                    $(this).css({"border-color": colors[colorIndex], "border-style": "solid"});
                    countTrueConBoxes++;
                    activeBoxes.push($(this));
                }
                colorIndex++;
            });
            callback();
        }

        function sendCountTrueConBoxesToServer(){
            clientSM_WithServer_Communication.sendFuncToMobileConn({
                'function':'getCountTrueConBoxes',
                'arguments':{'countTrueConBoxes':countTrueConBoxes}});
        }
    }

    //bestimmt den Index der aktuell ausgewählten ContentBox
    function getSelConBonIndex() {
        return selConBonIndex;
    }

    //setzt den Index der aktuell ausgewählten ContentBox
    function setSelConBonIndex(newConBonIndex) {
        selConBonIndex = newConBonIndex;
    }

    //gibt die aktuell sichtbaren und aktiven ContentBoxen zurück
    function getActiveBoxes(callback) {
        return activeBoxes;
    }

    //schließt den EditMode vom SmartMirror
    function closeEditMode() {
        $(contentBoxManager.getActiveBoxes()).each(function() {
            $(this).css({"border-color": "black", "border-style": "solid"});
        });
    }

    return {
        addContentBox: function () {
            return addContentBox();
        }
        , indexEditMode: function () {
            return indexEditMode();
        }
        , getSelConBonIndex: function () {
            return getSelConBonIndex();
        }
        , setSelConBonIndex: function (newConBonIndex) {
            return setSelConBonIndex(newConBonIndex);
        }
        , getActiveBoxes: function () {
            return getActiveBoxes();
        }
        , closeEditMode: function () {
            return closeEditMode();
        }
    }

}