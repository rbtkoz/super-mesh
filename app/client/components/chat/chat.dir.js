/**
 * Created by alexanderkozovski on 9/23/15.
 */
'use strict';

angular
    .module('sm.chat')
    .directive('chatModule', chatModule);

function chatModule(){

    return {

        restrict:'E',
        //template:'<h3>hello from the dead</h3>'
        transclude:true,
        scope: {
        },
        templateUrl:'app/client/components/chat/chat.html',
        link: function(scope, element,  attr){
            console.debug(scope);

        }
    }


}