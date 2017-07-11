/**
 * Created by Linh Do on 11.07.2017.
 */

var formWindow = makeFormWindow();

function makeFormWindow(){

    function init(){
        //initialisiere Funktionen für FormWindow (zum Komplimente hinzufügen)
        $("#form").validate({
            rules: {
                "name": {
                    required: true,
                    minlength: 2
                },
                "date": {
                    required: true,
                    date: true
                }
            },
            messages: {
                "name": {
                    required: "Bitte gib einen Namen ein"
                },
                "date": {
                    required: "Bitte gib dein Geburtstag ein",
                    email: "Tag ist ungültig"
                }
            },
            submitHandler: function (form) { // for demo
                $("#form").hide();
                $("#editMirrorWindow").show();
                $("#contextBoxPanel").show();
                mainAppWithServerCommunication.sendFuncToIndexConn({
                    "function":"addComplimentBox",
                    "arguments":{"name":$("#name").val().toString(),"date":$("#date").val().toString()}
                });

                alert('Kompliment hinzugefügt');
                return false;
            }
        });
    }

    function showFormElement(){
        $("#ipConnectWindow").hide();
        $(".contextBoxOptionsPanel").hide();
        $("#editMirrorWindow").hide();
        $("#contextBoxEditPanel").hide();
        $("#form").show();
    }

    return {
        showFormElement: function () {
            return showFormElement();
        }
        , init: function () {
            return init();
        }
    }
}