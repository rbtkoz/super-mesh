(function () {
    'use strict';
    angular.module('sm.session', []);
})();
(function(){
	'use strict';
	angular
		.module('sm.session')
		.run(appRun)

		function appRun(routerHelper){
			routerHelper.configureStates(getStates());
		}

		// getStates.$inject = ['$stateProvider', '$stateParams'];

		function getStates(){
			return [
				{
					state: 'session',
					config: {
						url: '/session/:id',
						controller: 'SessionController',
						templateUrl: 'client/components/session/view/session.view.html',
						resolve: {
							sessionID: function($stateParams) {
								return $stateParams.id;
							}
						}
					}
				}
			];
		};

})();
(function() {
	'use strict';
	angular
		.module('sm.session')
		.controller('SessionController', SessionController);

		SessionController.$inject = ['$scope', 'sessionID', '$firebaseObject', 'FIREBASE_URI'];

		function SessionController($scope, sessionID, $firebaseObject, FIREBASE_URI) {
			$scope.sessionID = sessionID;
			var sessionRef = new Firebase(FIREBASE_URI + 'Session' + '/' + sessionID);
			$scope.session = $firebaseObject(sessionRef);
		}

})();
(function() {
	'use strict'
	angular
		.module('sm.session')
		.directive('sessionTile', sessionTile);

		function sessionTile() {
			return {
				restrict: 'A',
				scope: {
					'session': '='
				},
				templateUrl: 'client/components/session/tile/session.tile.html'
			}
		}

})();
(function () {
	'use strict';
	angular.module('sm.router', []);
})();
(function () {
    'use strict';

    angular
        .module('sm.router')
        .provider('routerHelper', routerHelperProvider);

        routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

        function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
            /* jshint validthis:true */
            this.$get = RouterHelper;

            $locationProvider.html5Mode(true);

            RouterHelper.$inject = ['$state'];

            function RouterHelper($state) {
                var hasOtherwise = false;

                var service = {
                    configureStates: configureStates,
                    getStates: getStates
                };

                return service;

                ///////////////

                function configureStates(states, otherwisePath) {
                    states.forEach(function(state) {
                        $stateProvider.state(state.state, state.config);
                    });
                    if (otherwisePath && !hasOtherwise) {
                        hasOtherwise = true;
                        $urlRouterProvider.otherwise(otherwisePath);
                    }
                }

                function getStates() { return $state.get(); }
            }
        }

})();
(function () {
	'use strict';

	angular.module('sm.cc',[]);
	
})();
(function () {

	angular
		.module('sm.cc')
		.directive('navBar', navBar);

	function navBar() {

		var directive = {
			templateUrl: 'client/components/common/navbar/navbar.html',
			restrict: 'A'
		}

		return directive;
	}

})();
(function() {
    'use strict';

    angular.module('sm.signin', []);
})();
(function(){
	'use strict';
	angular
	.module('sm.signin')
	.run(appRun)

	function appRun(routerHelper){
		routerHelper.configureStates(getStates());
	}

	function getStates(){
		return [
		{
			state: 'signin',
			config: {
				url: '/',
				templateUrl: 'client/components/signin/signin.html'
			}
		}
		]
	}
})();
(function() {
    'use strict';

    angular
        .module('sm.signin')
        .controller('signInCtrl', signInCtrl);

    /* @ngInject */
    function signInCtrl() {
//         /*jshint validthis: true */
//         var vm = this;
//         vm.avengers = [];
//         vm.title = 'Avengers';

//         activate();

//         function activate() {
// //            Using a resolver on all routes or dataservice.ready in every controller
// //            var promises = [getAvengers()];
// //            return dataservice.ready(promises).then(function(){
//             return getAvengers().then(function() {
//                 logger.info('Activated Avengers View');
//             });
//         }

//         function getAvengers() {
//             return dataservice.getAvengers().then(function(data) {
//                 vm.avengers = data;
//                 return vm.avengers;
//             });
//         }
    }
})();
(function () {
	'use strict';
	angular.module('sm.schedule', []);
})();
(function(){
	'use strict';
	angular
		.module('sm.schedule')
		.run(appRun)

		function appRun(routerHelper){
			routerHelper.configureStates(getStates());
		};

		function getStates(){
			return [
				{
					state: 'schedule',
					config: {
						url: '/schedule',
						controller: 'ScheduleController',
						templateUrl: 'client/components/schedule/schedule.html'
					}
				}
			];
		};

})();
(function() {
	'use strict';
	angular
		.module('sm.schedule')
		.controller('ScheduleController', ScheduleController);

		ScheduleController.$inject = ['$scope', '$firebaseArray', 'FIREBASE_URI'];

		function ScheduleController ($scope, $firebaseArray, FIREBASE_URI) {
			var eventRef = new Firebase(FIREBASE_URI + 'Session');
			$scope.sessions = $firebaseArray(eventRef);
		}

})();
(function() {
    'use strict';

    angular
    	.module('sm.core', [])
    	.constant('FIREBASE_URI', 'https://luminous-inferno-640.firebaseio.com/');

})();
(function() {
    'use strict';

    angular
        .module('sm.core')
        .factory('dataservice', dataservice);

    /* @ngInject */
    function dataservice() {
    //     var isPrimed = false;
    //     var primePromise;

    //     var service = {
    //         getAvengersCast: getAvengersCast,
    //         getAvengerCount: getAvengerCount,
    //         getAvengers: getAvengers,
    //         ready: ready
    //     };

    //     return service;

    //     function getAvengers() {
    //         return $http.get('/api/maa')
    //             .then(getAvengersComplete)
    //             .catch(function(message) {
    //                 exception.catcher('XHR Failed for getAvengers')(message);
    //                 $location.url('/');
    //             });

    //         function getAvengersComplete(data, status, headers, config) {
    //             return data.data[0].data.results;
    //         }
    //     }

    //     function getAvengerCount() {
    //         var count = 0;
    //         return getAvengersCast()
    //             .then(getAvengersCastComplete)
    //             .catch(exception.catcher('XHR Failed for getAvengerCount'));

    //         function getAvengersCastComplete (data) {
    //             count = data.length;
    //             return $q.when(count);
    //         }
    //     }

    //     function getAvengersCast() {
    //         var cast = [
    //             {name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man'},
    //             {name: 'Chris Hemsworth', character: 'Thor'},
    //             {name: 'Chris Evans', character: 'Steve Rogers / Captain America'},
    //             {name: 'Mark Ruffalo', character: 'Bruce Banner / The Hulk'},
    //             {name: 'Scarlett Johansson', character: 'Natasha Romanoff / Black Widow'},
    //             {name: 'Jeremy Renner', character: 'Clint Barton / Hawkeye'},
    //             {name: 'Gwyneth Paltrow', character: 'Pepper Potts'},
    //             {name: 'Samuel L. Jackson', character: 'Nick Fury'},
    //             {name: 'Paul Bettany', character: 'Jarvis'},
    //             {name: 'Tom Hiddleston', character: 'Loki'},
    //             {name: 'Clark Gregg', character: 'Agent Phil Coulson'}
    //         ];
    //         return $q.when(cast);
    //     }

    //     function prime() {
    //         // This function can only be called once.
    //         if (primePromise) {
    //             return primePromise;
    //         }

    //         primePromise = $q.when(true).then(success);
    //         return primePromise;

    //         function success() {
    //             isPrimed = true;
    //             logger.info('Primed data');
    //         }
    //     }

    //     function ready(nextPromises) {
    //         var readyPromise = primePromise || prime();

    //         return readyPromise
    //             .then(function() { return $q.all(nextPromises); })
    //             .catch(exception.catcher('"ready" function failed'));
    //     }

    }
})();
(function() {
    'use strict';

    angular
        .module('sm.core')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        var otherwise = '/404';
        routerHelper.configureStates(getStates(), otherwise);
    }

    function getStates() {
        return [
            {
                state: '404',
                config: {
                    url: '/404',
                    templateUrl: 'client/components/core/404.html',
                    title: '404'
                }
            }
        ];
    }
})();
(function() {
    'use strict';

    angular.module('sm.chat', []);
})();
/**
 * Created by alexanderkozovski on 9/24/15.
 */
'use strict';

angular
    .module('sm.chat')
    .directive('chatModule', chatModule);

function chatModule(){


    return {

        restrict:'E',
        templateUrl:'/client/components/chat/chat.html',
        controller: 'chatCtrl'
        //link: function(scope, element,  attr){
        //    console.debug(scope);
        //
        //}

    };


}
(function() {
    'use strict';

    angular
        .module('sm.chat')
        .controller('chatCtrl', chatCtrl);

    chatCtrl.$inject = ['$scope', '$firebaseObject','$firebaseArray', 'FIREBASE_URI']

    /* @ngInject */
    function chatCtrl($scope, $firebaseObject,$firebaseArray, FIREBASE_URI) {

        // Create a new firebase reference
        var chatRef = new Firebase (FIREBASE_URI + 'Session' + '/' + $scope.sessionID + '/' + 'Messages');
        var userRef = new Firebase (FIREBASE_URI + 'Session' + '/' + $scope.sessionID + '/' + 'Users');
        //var voteRef = new Firebase (FIREBASE_URI + 'Session' + '/' + $scope.sessionID + '/' + 'Votes' )

        // var sessionRef = new Firebase(FIREBASE_URI + 'Session' + '/' + sessionID);
        
        $scope.user = 0;
        //create anon user with uid and limit session to browser open only.
        $scope.authAnonUser= function(username){
            chatRef.authAnonymously(function(error, authData) {
                if (error) {

                    console.log("Authentication Failed!", error);
                    $scope.user = false;
                } else {
                    userRef.push({id:authData.uid, name:username, token:authData.token});
                    console.log("Logged in as:", authData);
                    $scope.error= false;
                       $scope.$apply(function() {
                           $scope.user = authData;
                           $scope.username = username;
                       })
                }
            }, {
                remember: "session"
            });
        }

        $scope.messages = $firebaseArray(chatRef);

        //add messages to scope
        $scope.addMessage = function(){
            $scope.messages.$add({
                text:$scope.newMessageText,
                id: $scope.user.uid,
                name: $scope.username,
                votes: {},
                time:Firebase.ServerValue.TIMESTAMP
            });

        };

        //format Time from UNIX to human readable
        $scope.formatTime = function(timestamp) {
            var date = (timestamp) ? new Date(timestamp) : new Date(),
                hours = date.getHours() || 12,
                minutes = '' + date.getMinutes(),
                ampm = (date.getHours() >= 12) ? 'pm' : 'am';

            hours = (hours > 12) ? hours - 12 : hours;
            minutes = (minutes.length < 2) ? '0' + minutes : minutes;
            return '' + hours + ':' + minutes + ampm;
        };

        //listen for changes to model and pull user name
        chatRef.on("child_added", function(snapshot, prevChildKey) {
            var newMessage = snapshot.val();
            $scope.name = newMessage.name;

        });

        //Upvote function
        $scope.error= false;
        $scope.voted = false;

        $scope.upVote = function(index, message){
            if(!$scope.user){
                $scope.error =true;
            }else {

                console.log($scope.user.uid, "UID");

                    if (!message.votes) {
                        message.votes = {};
                    }
                console.log(message.votes[$scope.user.auth.uid]);
                    message.votes[$scope.user.auth.uid] = !($scope.user.auth.uid in message.votes) ? 0 : message.votes[$scope.user.auth.uid] + 1;

                    message.votecount = Object.keys(message.votes).length;
                    $scope.messages.$save(index);

                console.log('after', message);

                    //$scope.messages.votes = message.votecount;
                    //console.log($scope.messages);






                //$scope.error= false;
                //console.log(index);
                //message.votes++;
                //$scope.messages.$save(index);
                ////message.votes++;
                //
                //console.log($scope.user);
            }

        }




    }
})();
(function(){
	'use strict';
	angular.module('sm.admin',[]);
})();
(function(){

	angular
		.module('sm.admin')
		.run(appRun);

		function appRun(routerHelper){
			routerHelper.configureStates(getStates());
		};

		function getStates(){
			return [
				{
					state: 'admin',
					config: {
						url: '/admin',
						controller: 'AdminController',
						templateUrl: 'client/components/admin/admin.html'
					}
				}
			]
		}

})();
(function(){

	angular
		.module('sm.admin')
		.controller('AdminController', AdminController);

		AdminController.$inject = ['$scope', '$firebaseArray', 'FIREBASE_URI'];

		function AdminController($scope, $firebaseArray, FIREBASE_URI){
			var eventRef = new Firebase(FIREBASE_URI + 'Session');
			
			$scope.sessions = $firebaseArray(eventRef);

			$scope.submitSession = function(session){
				// eventRef.push(session);
				$scope.sessions.push(session);
			}

		}

})();
(function() {
    'use strict';

    angular.module('sm', [

        'ui.router',
        'firebase',

        /*
         * Order is not important.
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */ 
         
        'sm.core',
        'sm.router',

        /*
         * Feature areas
         */
         
        'sm.admin',
        'sm.cc',
        'sm.chat',
        'sm.session',
        'sm.schedule',
        'sm.signin'
    ]);

})();
(function() {
    'use strict';

    angular.module('sm.firebase',[])
    	.constant('FIREBASE_URI', 'https://luminous-inferno-640.firebaseio.com');

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlc3Npb24vc2Vzc2lvbi5tb2R1bGUuanMiLCJzZXNzaW9uL3ZpZXcvc2Vzc2lvbi52aWV3LnJvdXRlcy5qcyIsInNlc3Npb24vdmlldy9zZXNzaW9uLnZpZXcuY29udHJvbGxlci5qcyIsInNlc3Npb24vdGlsZS9zZXNzaW9uLnRpbGUuZGlyZWN0aXZlLmpzIiwiY29yZS9yb3V0ZXIvcm91dGVyLm1vZHVsZS5qcyIsImNvcmUvcm91dGVyL3JvdXRlci5wcm92aWRlci5qcyIsImNvbW1vbi9jYy5tb2R1bGUuanMiLCJjb21tb24vbmF2YmFyL25hdmJhci5kaXJlY3RpdmUuanMiLCJzaWduaW4vc2lnbmluLm1vZHVsZS5qcyIsInNpZ25pbi9zaWduaW4ucm91dGVzLmpzIiwic2lnbmluL3NpZ25pbi5jb250cm9sbGVyLmpzIiwic2NoZWR1bGUvc2NoZWR1bGUubW9kdWxlLmpzIiwic2NoZWR1bGUvc2NoZWR1bGUucm91dGVzLmpzIiwic2NoZWR1bGUvc2NoZWR1bGUuY29udHJvbGxlci5qcyIsImNvcmUvY29yZS5tb2R1bGUuanMiLCJjb3JlL2RhdGFzZXJ2aWNlLmpzIiwiY29yZS9jb3JlLnJvdXRlLmpzIiwiY2hhdC9jaGF0Lm1vZHVsZS5qcyIsImNoYXQvY2hhdC5kaXIuanMiLCJjaGF0L2NoYXQuY3RybC5qcyIsImFkbWluL2FkbWluLm1vZHVsZS5qcyIsImFkbWluL2FkbWluLnJvdXRlcy5qcyIsImFkbWluL2FkbWluLmNvbnRyb2xsZXIuanMiLCJzbS5tb2R1bGUuanMiLCJzbS5maXJlYmFzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3NtLnNlc3Npb24nLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdzbS5zZXNzaW9uJylcblx0XHQucnVuKGFwcFJ1bilcblxuXHRcdGZ1bmN0aW9uIGFwcFJ1bihyb3V0ZXJIZWxwZXIpe1xuXHRcdFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSk7XG5cdFx0fVxuXG5cdFx0Ly8gZ2V0U3RhdGVzLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyRzdGF0ZVBhcmFtcyddO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0U3RhdGVzKCl7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RhdGU6ICdzZXNzaW9uJyxcblx0XHRcdFx0XHRjb25maWc6IHtcblx0XHRcdFx0XHRcdHVybDogJy9zZXNzaW9uLzppZCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2Vzc2lvbkNvbnRyb2xsZXInLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9zZXNzaW9uL3ZpZXcvc2Vzc2lvbi52aWV3Lmh0bWwnLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRzZXNzaW9uSUQ6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAkc3RhdGVQYXJhbXMuaWQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdF07XG5cdFx0fTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3NtLnNlc3Npb24nKVxuXHRcdC5jb250cm9sbGVyKCdTZXNzaW9uQ29udHJvbGxlcicsIFNlc3Npb25Db250cm9sbGVyKTtcblxuXHRcdFNlc3Npb25Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdzZXNzaW9uSUQnLCAnJGZpcmViYXNlT2JqZWN0JywgJ0ZJUkVCQVNFX1VSSSddO1xuXG5cdFx0ZnVuY3Rpb24gU2Vzc2lvbkNvbnRyb2xsZXIoJHNjb3BlLCBzZXNzaW9uSUQsICRmaXJlYmFzZU9iamVjdCwgRklSRUJBU0VfVVJJKSB7XG5cdFx0XHQkc2NvcGUuc2Vzc2lvbklEID0gc2Vzc2lvbklEO1xuXHRcdFx0dmFyIHNlc3Npb25SZWYgPSBuZXcgRmlyZWJhc2UoRklSRUJBU0VfVVJJICsgJ1Nlc3Npb24nICsgJy8nICsgc2Vzc2lvbklEKTtcblx0XHRcdCRzY29wZS5zZXNzaW9uID0gJGZpcmViYXNlT2JqZWN0KHNlc3Npb25SZWYpO1xuXHRcdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uc2Vzc2lvbicpXG5cdFx0LmRpcmVjdGl2ZSgnc2Vzc2lvblRpbGUnLCBzZXNzaW9uVGlsZSk7XG5cblx0XHRmdW5jdGlvbiBzZXNzaW9uVGlsZSgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdFx0J3Nlc3Npb24nOiAnPSdcblx0XHRcdFx0fSxcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9zZXNzaW9uL3RpbGUvc2Vzc2lvbi50aWxlLmh0bWwnXG5cdFx0XHR9XG5cdFx0fVxuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0YW5ndWxhci5tb2R1bGUoJ3NtLnJvdXRlcicsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3NtLnJvdXRlcicpXG4gICAgICAgIC5wcm92aWRlcigncm91dGVySGVscGVyJywgcm91dGVySGVscGVyUHJvdmlkZXIpO1xuXG4gICAgICAgIHJvdXRlckhlbHBlclByb3ZpZGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvblByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlciddO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJvdXRlckhlbHBlclByb3ZpZGVyKCRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgICAgIHRoaXMuJGdldCA9IFJvdXRlckhlbHBlcjtcblxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuXG4gICAgICAgICAgICBSb3V0ZXJIZWxwZXIuJGluamVjdCA9IFsnJHN0YXRlJ107XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIFJvdXRlckhlbHBlcigkc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFzT3RoZXJ3aXNlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJlU3RhdGVzOiBjb25maWd1cmVTdGF0ZXMsXG4gICAgICAgICAgICAgICAgICAgIGdldFN0YXRlczogZ2V0U3RhdGVzXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjb25maWd1cmVTdGF0ZXMoc3RhdGVzLCBvdGhlcndpc2VQYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShzdGF0ZS5zdGF0ZSwgc3RhdGUuY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlcndpc2VQYXRoICYmICFoYXNPdGhlcndpc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc090aGVyd2lzZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKG90aGVyd2lzZVBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0U3RhdGVzKCkgeyByZXR1cm4gJHN0YXRlLmdldCgpOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ3NtLmNjJyxbXSk7XG5cdFxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdzbS5jYycpXG5cdFx0LmRpcmVjdGl2ZSgnbmF2QmFyJywgbmF2QmFyKTtcblxuXHRmdW5jdGlvbiBuYXZCYXIoKSB7XG5cblx0XHR2YXIgZGlyZWN0aXZlID0ge1xuXHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9jb21tb24vbmF2YmFyL25hdmJhci5odG1sJyxcblx0XHRcdHJlc3RyaWN0OiAnQSdcblx0XHR9XG5cblx0XHRyZXR1cm4gZGlyZWN0aXZlO1xuXHR9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzbS5zaWduaW4nLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXJcblx0Lm1vZHVsZSgnc20uc2lnbmluJylcblx0LnJ1bihhcHBSdW4pXG5cblx0ZnVuY3Rpb24gYXBwUnVuKHJvdXRlckhlbHBlcil7XG5cdFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSk7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRTdGF0ZXMoKXtcblx0XHRyZXR1cm4gW1xuXHRcdHtcblx0XHRcdHN0YXRlOiAnc2lnbmluJyxcblx0XHRcdGNvbmZpZzoge1xuXHRcdFx0XHR1cmw6ICcvJyxcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9zaWduaW4vc2lnbmluLmh0bWwnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdF1cblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdzbS5zaWduaW4nKVxuICAgICAgICAuY29udHJvbGxlcignc2lnbkluQ3RybCcsIHNpZ25JbkN0cmwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gc2lnbkluQ3RybCgpIHtcbi8vICAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4vLyAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4vLyAgICAgICAgIHZtLmF2ZW5nZXJzID0gW107XG4vLyAgICAgICAgIHZtLnRpdGxlID0gJ0F2ZW5nZXJzJztcblxuLy8gICAgICAgICBhY3RpdmF0ZSgpO1xuXG4vLyAgICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuLy8gLy8gICAgICAgICAgICBVc2luZyBhIHJlc29sdmVyIG9uIGFsbCByb3V0ZXMgb3IgZGF0YXNlcnZpY2UucmVhZHkgaW4gZXZlcnkgY29udHJvbGxlclxuLy8gLy8gICAgICAgICAgICB2YXIgcHJvbWlzZXMgPSBbZ2V0QXZlbmdlcnMoKV07XG4vLyAvLyAgICAgICAgICAgIHJldHVybiBkYXRhc2VydmljZS5yZWFkeShwcm9taXNlcykudGhlbihmdW5jdGlvbigpe1xuLy8gICAgICAgICAgICAgcmV0dXJuIGdldEF2ZW5nZXJzKCkudGhlbihmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnQWN0aXZhdGVkIEF2ZW5nZXJzIFZpZXcnKTtcbi8vICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlcnMoKSB7XG4vLyAgICAgICAgICAgICByZXR1cm4gZGF0YXNlcnZpY2UuZ2V0QXZlbmdlcnMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbi8vICAgICAgICAgICAgICAgICB2bS5hdmVuZ2VycyA9IGRhdGE7XG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLmF2ZW5nZXJzO1xuLy8gICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0YW5ndWxhci5tb2R1bGUoJ3NtLnNjaGVkdWxlJywgW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnO1xuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uc2NoZWR1bGUnKVxuXHRcdC5ydW4oYXBwUnVuKVxuXG5cdFx0ZnVuY3Rpb24gYXBwUnVuKHJvdXRlckhlbHBlcil7XG5cdFx0XHRyb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKGdldFN0YXRlcygpKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0U3RhdGVzKCl7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RhdGU6ICdzY2hlZHVsZScsXG5cdFx0XHRcdFx0Y29uZmlnOiB7XG5cdFx0XHRcdFx0XHR1cmw6ICcvc2NoZWR1bGUnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ1NjaGVkdWxlQ29udHJvbGxlcicsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2NsaWVudC9jb21wb25lbnRzL3NjaGVkdWxlL3NjaGVkdWxlLmh0bWwnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRdO1xuXHRcdH07XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdzbS5zY2hlZHVsZScpXG5cdFx0LmNvbnRyb2xsZXIoJ1NjaGVkdWxlQ29udHJvbGxlcicsIFNjaGVkdWxlQ29udHJvbGxlcik7XG5cblx0XHRTY2hlZHVsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRmaXJlYmFzZUFycmF5JywgJ0ZJUkVCQVNFX1VSSSddO1xuXG5cdFx0ZnVuY3Rpb24gU2NoZWR1bGVDb250cm9sbGVyICgkc2NvcGUsICRmaXJlYmFzZUFycmF5LCBGSVJFQkFTRV9VUkkpIHtcblx0XHRcdHZhciBldmVudFJlZiA9IG5ldyBGaXJlYmFzZShGSVJFQkFTRV9VUkkgKyAnU2Vzc2lvbicpO1xuXHRcdFx0JHNjb3BlLnNlc3Npb25zID0gJGZpcmViYXNlQXJyYXkoZXZlbnRSZWYpO1xuXHRcdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnc20uY29yZScsIFtdKVxuICAgIFx0LmNvbnN0YW50KCdGSVJFQkFTRV9VUkknLCAnaHR0cHM6Ly9sdW1pbm91cy1pbmZlcm5vLTY0MC5maXJlYmFzZWlvLmNvbS8nKTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdzbS5jb3JlJylcbiAgICAgICAgLmZhY3RvcnkoJ2RhdGFzZXJ2aWNlJywgZGF0YXNlcnZpY2UpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gZGF0YXNlcnZpY2UoKSB7XG4gICAgLy8gICAgIHZhciBpc1ByaW1lZCA9IGZhbHNlO1xuICAgIC8vICAgICB2YXIgcHJpbWVQcm9taXNlO1xuXG4gICAgLy8gICAgIHZhciBzZXJ2aWNlID0ge1xuICAgIC8vICAgICAgICAgZ2V0QXZlbmdlcnNDYXN0OiBnZXRBdmVuZ2Vyc0Nhc3QsXG4gICAgLy8gICAgICAgICBnZXRBdmVuZ2VyQ291bnQ6IGdldEF2ZW5nZXJDb3VudCxcbiAgICAvLyAgICAgICAgIGdldEF2ZW5nZXJzOiBnZXRBdmVuZ2VycyxcbiAgICAvLyAgICAgICAgIHJlYWR5OiByZWFkeVxuICAgIC8vICAgICB9O1xuXG4gICAgLy8gICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgLy8gICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzKCkge1xuICAgIC8vICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9tYWEnKVxuICAgIC8vICAgICAgICAgICAgIC50aGVuKGdldEF2ZW5nZXJzQ29tcGxldGUpXG4gICAgLy8gICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgZXhjZXB0aW9uLmNhdGNoZXIoJ1hIUiBGYWlsZWQgZm9yIGdldEF2ZW5nZXJzJykobWVzc2FnZSk7XG4gICAgLy8gICAgICAgICAgICAgICAgICRsb2NhdGlvbi51cmwoJy8nKTtcbiAgICAvLyAgICAgICAgICAgICB9KTtcblxuICAgIC8vICAgICAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlcnNDb21wbGV0ZShkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiBkYXRhLmRhdGFbMF0uZGF0YS5yZXN1bHRzO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlckNvdW50KCkge1xuICAgIC8vICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAvLyAgICAgICAgIHJldHVybiBnZXRBdmVuZ2Vyc0Nhc3QoKVxuICAgIC8vICAgICAgICAgICAgIC50aGVuKGdldEF2ZW5nZXJzQ2FzdENvbXBsZXRlKVxuICAgIC8vICAgICAgICAgICAgIC5jYXRjaChleGNlcHRpb24uY2F0Y2hlcignWEhSIEZhaWxlZCBmb3IgZ2V0QXZlbmdlckNvdW50JykpO1xuXG4gICAgLy8gICAgICAgICBmdW5jdGlvbiBnZXRBdmVuZ2Vyc0Nhc3RDb21wbGV0ZSAoZGF0YSkge1xuICAgIC8vICAgICAgICAgICAgIGNvdW50ID0gZGF0YS5sZW5ndGg7XG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oY291bnQpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlcnNDYXN0KCkge1xuICAgIC8vICAgICAgICAgdmFyIGNhc3QgPSBbXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdSb2JlcnQgRG93bmV5IEpyLicsIGNoYXJhY3RlcjogJ1RvbnkgU3RhcmsgLyBJcm9uIE1hbid9LFxuICAgIC8vICAgICAgICAgICAgIHtuYW1lOiAnQ2hyaXMgSGVtc3dvcnRoJywgY2hhcmFjdGVyOiAnVGhvcid9LFxuICAgIC8vICAgICAgICAgICAgIHtuYW1lOiAnQ2hyaXMgRXZhbnMnLCBjaGFyYWN0ZXI6ICdTdGV2ZSBSb2dlcnMgLyBDYXB0YWluIEFtZXJpY2EnfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ01hcmsgUnVmZmFsbycsIGNoYXJhY3RlcjogJ0JydWNlIEJhbm5lciAvIFRoZSBIdWxrJ30sXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdTY2FybGV0dCBKb2hhbnNzb24nLCBjaGFyYWN0ZXI6ICdOYXRhc2hhIFJvbWFub2ZmIC8gQmxhY2sgV2lkb3cnfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ0plcmVteSBSZW5uZXInLCBjaGFyYWN0ZXI6ICdDbGludCBCYXJ0b24gLyBIYXdrZXllJ30sXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdHd3luZXRoIFBhbHRyb3cnLCBjaGFyYWN0ZXI6ICdQZXBwZXIgUG90dHMnfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ1NhbXVlbCBMLiBKYWNrc29uJywgY2hhcmFjdGVyOiAnTmljayBGdXJ5J30sXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdQYXVsIEJldHRhbnknLCBjaGFyYWN0ZXI6ICdKYXJ2aXMnfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ1RvbSBIaWRkbGVzdG9uJywgY2hhcmFjdGVyOiAnTG9raSd9LFxuICAgIC8vICAgICAgICAgICAgIHtuYW1lOiAnQ2xhcmsgR3JlZ2cnLCBjaGFyYWN0ZXI6ICdBZ2VudCBQaGlsIENvdWxzb24nfVxuICAgIC8vICAgICAgICAgXTtcbiAgICAvLyAgICAgICAgIHJldHVybiAkcS53aGVuKGNhc3QpO1xuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgZnVuY3Rpb24gcHJpbWUoKSB7XG4gICAgLy8gICAgICAgICAvLyBUaGlzIGZ1bmN0aW9uIGNhbiBvbmx5IGJlIGNhbGxlZCBvbmNlLlxuICAgIC8vICAgICAgICAgaWYgKHByaW1lUHJvbWlzZSkge1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiBwcmltZVByb21pc2U7XG4gICAgLy8gICAgICAgICB9XG5cbiAgICAvLyAgICAgICAgIHByaW1lUHJvbWlzZSA9ICRxLndoZW4odHJ1ZSkudGhlbihzdWNjZXNzKTtcbiAgICAvLyAgICAgICAgIHJldHVybiBwcmltZVByb21pc2U7XG5cbiAgICAvLyAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG4gICAgLy8gICAgICAgICAgICAgaXNQcmltZWQgPSB0cnVlO1xuICAgIC8vICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcmltZWQgZGF0YScpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgZnVuY3Rpb24gcmVhZHkobmV4dFByb21pc2VzKSB7XG4gICAgLy8gICAgICAgICB2YXIgcmVhZHlQcm9taXNlID0gcHJpbWVQcm9taXNlIHx8IHByaW1lKCk7XG5cbiAgICAvLyAgICAgICAgIHJldHVybiByZWFkeVByb21pc2VcbiAgICAvLyAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHsgcmV0dXJuICRxLmFsbChuZXh0UHJvbWlzZXMpOyB9KVxuICAgIC8vICAgICAgICAgICAgIC5jYXRjaChleGNlcHRpb24uY2F0Y2hlcignXCJyZWFkeVwiIGZ1bmN0aW9uIGZhaWxlZCcpKTtcbiAgICAvLyAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdzbS5jb3JlJylcbiAgICAgICAgLnJ1bihhcHBSdW4pO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gYXBwUnVuKHJvdXRlckhlbHBlcikge1xuICAgICAgICB2YXIgb3RoZXJ3aXNlID0gJy80MDQnO1xuICAgICAgICByb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKGdldFN0YXRlcygpLCBvdGhlcndpc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0YXRlcygpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogJzQwNCcsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy80MDQnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NsaWVudC9jb21wb25lbnRzL2NvcmUvNDA0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJzQwNCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NtLmNoYXQnLCBbXSk7XG59KSgpOyIsIi8qKlxuICogQ3JlYXRlZCBieSBhbGV4YW5kZXJrb3pvdnNraSBvbiA5LzI0LzE1LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdzbS5jaGF0JylcbiAgICAuZGlyZWN0aXZlKCdjaGF0TW9kdWxlJywgY2hhdE1vZHVsZSk7XG5cbmZ1bmN0aW9uIGNoYXRNb2R1bGUoKXtcblxuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICByZXN0cmljdDonRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOicvY2xpZW50L2NvbXBvbmVudHMvY2hhdC9jaGF0Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnY2hhdEN0cmwnXG4gICAgICAgIC8vbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsICBhdHRyKXtcbiAgICAgICAgLy8gICAgY29uc29sZS5kZWJ1ZyhzY29wZSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vfVxuXG4gICAgfTtcblxuXG59IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnc20uY2hhdCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdjaGF0Q3RybCcsIGNoYXRDdHJsKTtcblxuICAgIGNoYXRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckZmlyZWJhc2VPYmplY3QnLCckZmlyZWJhc2VBcnJheScsICdGSVJFQkFTRV9VUkknXVxuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gY2hhdEN0cmwoJHNjb3BlLCAkZmlyZWJhc2VPYmplY3QsJGZpcmViYXNlQXJyYXksIEZJUkVCQVNFX1VSSSkge1xuXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBmaXJlYmFzZSByZWZlcmVuY2VcbiAgICAgICAgdmFyIGNoYXRSZWYgPSBuZXcgRmlyZWJhc2UgKEZJUkVCQVNFX1VSSSArICdTZXNzaW9uJyArICcvJyArICRzY29wZS5zZXNzaW9uSUQgKyAnLycgKyAnTWVzc2FnZXMnKTtcbiAgICAgICAgdmFyIHVzZXJSZWYgPSBuZXcgRmlyZWJhc2UgKEZJUkVCQVNFX1VSSSArICdTZXNzaW9uJyArICcvJyArICRzY29wZS5zZXNzaW9uSUQgKyAnLycgKyAnVXNlcnMnKTtcbiAgICAgICAgLy92YXIgdm90ZVJlZiA9IG5ldyBGaXJlYmFzZSAoRklSRUJBU0VfVVJJICsgJ1Nlc3Npb24nICsgJy8nICsgJHNjb3BlLnNlc3Npb25JRCArICcvJyArICdWb3RlcycgKVxuXG4gICAgICAgIC8vIHZhciBzZXNzaW9uUmVmID0gbmV3IEZpcmViYXNlKEZJUkVCQVNFX1VSSSArICdTZXNzaW9uJyArICcvJyArIHNlc3Npb25JRCk7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUudXNlciA9IDA7XG4gICAgICAgIC8vY3JlYXRlIGFub24gdXNlciB3aXRoIHVpZCBhbmQgbGltaXQgc2Vzc2lvbiB0byBicm93c2VyIG9wZW4gb25seS5cbiAgICAgICAgJHNjb3BlLmF1dGhBbm9uVXNlcj0gZnVuY3Rpb24odXNlcm5hbWUpe1xuICAgICAgICAgICAgY2hhdFJlZi5hdXRoQW5vbnltb3VzbHkoZnVuY3Rpb24oZXJyb3IsIGF1dGhEYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdXRoZW50aWNhdGlvbiBGYWlsZWQhXCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1c2VyUmVmLnB1c2goe2lkOmF1dGhEYXRhLnVpZCwgbmFtZTp1c2VybmFtZSwgdG9rZW46YXV0aERhdGEudG9rZW59KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2dnZWQgaW4gYXM6XCIsIGF1dGhEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51c2VyID0gYXV0aERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgcmVtZW1iZXI6IFwic2Vzc2lvblwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5tZXNzYWdlcyA9ICRmaXJlYmFzZUFycmF5KGNoYXRSZWYpO1xuXG4gICAgICAgIC8vYWRkIG1lc3NhZ2VzIHRvIHNjb3BlXG4gICAgICAgICRzY29wZS5hZGRNZXNzYWdlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlcy4kYWRkKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiRzY29wZS5uZXdNZXNzYWdlVGV4dCxcbiAgICAgICAgICAgICAgICBpZDogJHNjb3BlLnVzZXIudWlkLFxuICAgICAgICAgICAgICAgIG5hbWU6ICRzY29wZS51c2VybmFtZSxcbiAgICAgICAgICAgICAgICB2b3Rlczoge30sXG4gICAgICAgICAgICAgICAgdGltZTpGaXJlYmFzZS5TZXJ2ZXJWYWx1ZS5USU1FU1RBTVBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgLy9mb3JtYXQgVGltZSBmcm9tIFVOSVggdG8gaHVtYW4gcmVhZGFibGVcbiAgICAgICAgJHNjb3BlLmZvcm1hdFRpbWUgPSBmdW5jdGlvbih0aW1lc3RhbXApIHtcbiAgICAgICAgICAgIHZhciBkYXRlID0gKHRpbWVzdGFtcCkgPyBuZXcgRGF0ZSh0aW1lc3RhbXApIDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICBob3VycyA9IGRhdGUuZ2V0SG91cnMoKSB8fCAxMixcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gJycgKyBkYXRlLmdldE1pbnV0ZXMoKSxcbiAgICAgICAgICAgICAgICBhbXBtID0gKGRhdGUuZ2V0SG91cnMoKSA+PSAxMikgPyAncG0nIDogJ2FtJztcblxuICAgICAgICAgICAgaG91cnMgPSAoaG91cnMgPiAxMikgPyBob3VycyAtIDEyIDogaG91cnM7XG4gICAgICAgICAgICBtaW51dGVzID0gKG1pbnV0ZXMubGVuZ3RoIDwgMikgPyAnMCcgKyBtaW51dGVzIDogbWludXRlcztcbiAgICAgICAgICAgIHJldHVybiAnJyArIGhvdXJzICsgJzonICsgbWludXRlcyArIGFtcG07XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9saXN0ZW4gZm9yIGNoYW5nZXMgdG8gbW9kZWwgYW5kIHB1bGwgdXNlciBuYW1lXG4gICAgICAgIGNoYXRSZWYub24oXCJjaGlsZF9hZGRlZFwiLCBmdW5jdGlvbihzbmFwc2hvdCwgcHJldkNoaWxkS2V5KSB7XG4gICAgICAgICAgICB2YXIgbmV3TWVzc2FnZSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAgICAgJHNjb3BlLm5hbWUgPSBuZXdNZXNzYWdlLm5hbWU7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9VcHZvdGUgZnVuY3Rpb25cbiAgICAgICAgJHNjb3BlLmVycm9yPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnZvdGVkID0gZmFsc2U7XG5cbiAgICAgICAgJHNjb3BlLnVwVm90ZSA9IGZ1bmN0aW9uKGluZGV4LCBtZXNzYWdlKXtcbiAgICAgICAgICAgIGlmKCEkc2NvcGUudXNlcil7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID10cnVlO1xuICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnVzZXIudWlkLCBcIlVJRFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1lc3NhZ2Uudm90ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2Uudm90ZXMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2Uudm90ZXNbJHNjb3BlLnVzZXIuYXV0aC51aWRdKTtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS52b3Rlc1skc2NvcGUudXNlci5hdXRoLnVpZF0gPSAhKCRzY29wZS51c2VyLmF1dGgudWlkIGluIG1lc3NhZ2Uudm90ZXMpID8gMCA6IG1lc3NhZ2Uudm90ZXNbJHNjb3BlLnVzZXIuYXV0aC51aWRdICsgMTtcblxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLnZvdGVjb3VudCA9IE9iamVjdC5rZXlzKG1lc3NhZ2Uudm90ZXMpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2VzLiRzYXZlKGluZGV4KTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhZnRlcicsIG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vJHNjb3BlLm1lc3NhZ2VzLnZvdGVzID0gbWVzc2FnZS52b3RlY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJHNjb3BlLm1lc3NhZ2VzKTtcblxuXG5cblxuXG5cbiAgICAgICAgICAgICAgICAvLyRzY29wZS5lcnJvcj0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpbmRleCk7XG4gICAgICAgICAgICAgICAgLy9tZXNzYWdlLnZvdGVzKys7XG4gICAgICAgICAgICAgICAgLy8kc2NvcGUubWVzc2FnZXMuJHNhdmUoaW5kZXgpO1xuICAgICAgICAgICAgICAgIC8vLy9tZXNzYWdlLnZvdGVzKys7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRzY29wZS51c2VyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuXG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXIubW9kdWxlKCdzbS5hZG1pbicsW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uYWRtaW4nKVxuXHRcdC5ydW4oYXBwUnVuKTtcblxuXHRcdGZ1bmN0aW9uIGFwcFJ1bihyb3V0ZXJIZWxwZXIpe1xuXHRcdFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldFN0YXRlcygpe1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0YXRlOiAnYWRtaW4nLFxuXHRcdFx0XHRcdGNvbmZpZzoge1xuXHRcdFx0XHRcdFx0dXJsOiAnL2FkbWluJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdBZG1pbkNvbnRyb2xsZXInLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9hZG1pbi9hZG1pbi5odG1sJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uYWRtaW4nKVxuXHRcdC5jb250cm9sbGVyKCdBZG1pbkNvbnRyb2xsZXInLCBBZG1pbkNvbnRyb2xsZXIpO1xuXG5cdFx0QWRtaW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckZmlyZWJhc2VBcnJheScsICdGSVJFQkFTRV9VUkknXTtcblxuXHRcdGZ1bmN0aW9uIEFkbWluQ29udHJvbGxlcigkc2NvcGUsICRmaXJlYmFzZUFycmF5LCBGSVJFQkFTRV9VUkkpe1xuXHRcdFx0dmFyIGV2ZW50UmVmID0gbmV3IEZpcmViYXNlKEZJUkVCQVNFX1VSSSArICdTZXNzaW9uJyk7XG5cdFx0XHRcblx0XHRcdCRzY29wZS5zZXNzaW9ucyA9ICRmaXJlYmFzZUFycmF5KGV2ZW50UmVmKTtcblxuXHRcdFx0JHNjb3BlLnN1Ym1pdFNlc3Npb24gPSBmdW5jdGlvbihzZXNzaW9uKXtcblx0XHRcdFx0Ly8gZXZlbnRSZWYucHVzaChzZXNzaW9uKTtcblx0XHRcdFx0JHNjb3BlLnNlc3Npb25zLnB1c2goc2Vzc2lvbik7XG5cdFx0XHR9XG5cblx0XHR9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzbScsIFtcblxuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ2ZpcmViYXNlJyxcblxuICAgICAgICAvKlxuICAgICAgICAgKiBPcmRlciBpcyBub3QgaW1wb3J0YW50LlxuICAgICAgICAgKiBFdmVyeWJvZHkgaGFzIGFjY2VzcyB0byB0aGVzZS5cbiAgICAgICAgICogV2UgY291bGQgcGxhY2UgdGhlc2UgdW5kZXIgZXZlcnkgZmVhdHVyZSBhcmVhLFxuICAgICAgICAgKiBidXQgdGhpcyBpcyBlYXNpZXIgdG8gbWFpbnRhaW4uXG4gICAgICAgICAqLyBcbiAgICAgICAgIFxuICAgICAgICAnc20uY29yZScsXG4gICAgICAgICdzbS5yb3V0ZXInLFxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEZlYXR1cmUgYXJlYXNcbiAgICAgICAgICovXG4gICAgICAgICBcbiAgICAgICAgJ3NtLmFkbWluJyxcbiAgICAgICAgJ3NtLmNjJyxcbiAgICAgICAgJ3NtLmNoYXQnLFxuICAgICAgICAnc20uc2Vzc2lvbicsXG4gICAgICAgICdzbS5zY2hlZHVsZScsXG4gICAgICAgICdzbS5zaWduaW4nXG4gICAgXSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzbS5maXJlYmFzZScsW10pXG4gICAgXHQuY29uc3RhbnQoJ0ZJUkVCQVNFX1VSSScsICdodHRwczovL2x1bWlub3VzLWluZmVybm8tNjQwLmZpcmViYXNlaW8uY29tJyk7XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9