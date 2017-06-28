/**
 * Created by Linh Do on 27.06.2017.
 */
/**
 * Funktionen, die die ausgewählte ContentBox verändern
 */

var changeBoxFunctions = makeChangeBoxFunctions();

function makeChangeBoxFunctions() {

    //bewegt die ausgewählte ContentBox nach oben
    function upButton() {
        var position = contentBoxManager.getActiveBoxes()[contentBoxManager.getSelConBonIndex()].offset();
        contentBoxManager.getActiveBoxes()[contentBoxManager.getSelConBonIndex()].css({"position":"absolute", "top": position.top- $(document).scrollTop()-5});
    }

    //bewegt die ausgewählte ContentBox nach rechts
    function rightButton() {
        var position = contentBoxManager.getActiveBoxes()[contentBoxManager.getSelConBonIndex()].offset();
        contentBoxManager.getActiveBoxes()[contentBoxManager.getSelConBonIndex()].css({"position":"absolute", "left": position.left- $(document).scrollLeft()+5});
    }

    //bewegt die ausgewählte ContentBox nach unten
    function downButton() {
        var position = contentBoxManager.getActiveBoxes()[contentBoxManager.getSelConBonIndex()].offset();
        contentBoxManager.getActiveBoxes()[contentBoxManager.getSelConBonIndex()].css({"position":"absolute", "top": position.top- $(document).scrollTop()+5});
    }

    //bewegt die ausgewählte ContentBox nach links
    function leftButton() {
        var position = contentBoxManager.getActiveBoxes()[contentBoxManager.getSelConBonIndex()].offset();
        contentBoxManager.getActiveBoxes()[contentBoxManager.getSelConBonIndex()].css({"position":"absolute", "left": position.left- $(document).scrollLeft()-5});
    }

    //löscht die ausgewählte ContentBox
    function deleteContentBox() {
        contentBoxManager.getActiveBoxes()[contentBoxManager.getSelConBonIndex()].remove();
        contentBoxManager.indexEditMode();
    }

    //ändert, welche Contentbox ausgewählt ist
    function changeConBoxWithIndex(messageobj) {
        contentBoxManager.setSelConBonIndex(messageobj.arguments.conBonIndex);
        var oldConBonIndex = messageobj.arguments.oldConBonIndex;
        contentBoxManager.getActiveBoxes()[oldConBonIndex].css({"border-style": "solid"});
        contentBoxManager.getActiveBoxes()[contentBoxManager.getSelConBonIndex()].css({"border-style": "dotted"});
    }

    return {
        upButton: function () {
            return upButton();
        }
        , rightButton: function () {
            return rightButton();
        }
        , downButton: function () {
            return downButton();
        }
        , leftButton: function () {
            return leftButton();
        }
        , deleteContentBox: function () {
            return deleteContentBox();
        }
        , changeConBoxWithIndex: function (messageobj) {
            return changeConBoxWithIndex(messageobj);
        }
    }
}