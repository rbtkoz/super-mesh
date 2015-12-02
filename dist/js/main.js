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
			$scope.vote = 0;
			$scope.sessionVote = function(){
				$scope.vote ++
			}

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
(function() {
    'use strict';

    angular.module('sm.participant', []);
})();
'use strict';

angular
    .module('sm.participant')
    .directive('participantImg', participantImg);

function participantImg(){
		var directive = {
			link: link,
      templateUrl:'/client/components/participant/meshpoints/meshpts.html',
    	restrict: 'E'
    };
    return directive;
    function link(scope, element, attrs){
    	angular.element(document).ready(function () {
            var links = [];
            var links_count = 32;
            var connects_time = 240;
            var connects_count = 2;
            var theme_start = { X:150, Y:150, W:300, H:300 };

            function limit_number(min, cur, max) {
                if (cur < min) return min;
                if (cur > max) return max;
                return cur;
            }

            function print_rgba(r, g, b, a) { return "rgba("+r+","+g+","+b+","+a+")"; }

            function Linker()
            {
                var connects = [];
                for (var i=0;i<connects_count;i++) connects.push(Connector());

                    var start_x = Math.random() * theme_start.W;
                var start_y = Math.random() * theme_start.H;

                return {
                    X: start_x,
                    Y: start_y,
                    TX: start_x,
                    TY: start_y,
                    NewJob: function() {
                        var tx = this.X + Math.random() * 200 - 100;
                        var ty = this.Y + Math.random() * 200 - 100;

                        this.TX = limit_number(Math.random() * 50, tx, theme_start.W - Math.random() * 50);
                        this.TY = limit_number(Math.random() * 50, ty, theme_start.H - Math.random() * 50);
                    },
                    Moving: function() { return Math.sqrt(Math.pow(this.TX - this.X, 2) + Math.pow(this.TY - this.Y, 2)) > 1; },
                    Connectors: connects
                };
            }

            function Connector()
            {
                return { 
                    Time:-1,
                    Target:null,
                    NewJob:function(){ this.Target = Math.floor(Math.random() * links_count); this.Time = Math.random() * connects_time; }
                };
            }

            function init() {
                for (var i = 0; i < links_count; i++) links.push(Linker());
                    window.requestAnimationFrame(draw);
            }

            function draw()
            {
                for (var i = 0; i < links_count; i++) {
                    if (!links[i].Moving()) links[i].NewJob();
                    links[i].X += (links[i].TX - links[i].X) / 24;
                    links[i].Y += (links[i].TY - links[i].Y) / 24;

                    for(var j=0;j<links[i].Connectors.length;j++) {
                        if (links[i].Connectors[j].Time < 0) links[i].Connectors[j].NewJob();
                        links[i].Connectors[j].Time -= 1;
                    }
                }

                var canvas = document.getElementById('frame');
                if (canvas.getContext)
                {
                    var ctx = canvas.getContext('2d');
                    canvas.width = window.innerWidth;
                    canvas.height = 300;

                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.clearRect(0, 0, theme_start.W, theme_start.H);
                    ctx.strokeStyle = "#C0BFBE";
                    ctx.fillStyle = "#C0BFBE";

                    for (var i=0; i<links_count; i++) {
                        for(var j=0;j<links[i].Connectors.length;j++) {
                            var connect = links[links[i].Connectors[j].Target];

                            var linesPath = new Path2D();
                            linesPath.moveTo(links[i].X, links[i].Y);
                            linesPath.lineTo(connect.X, connect.Y);
                            ctx.strokeStyle = print_rgba(98, 98, 98, limit_number(.3, links[i].Connectors[j].Time / 100, 1));
                            ctx.stroke(linesPath);
                        }
                    }

                    var arcPath = new Path2D();
                    for (var i=0; i<links_count; i++) {
                        arcPath.moveTo(links[i].X, links[i].Y);
                        arcPath.arc(links[i].X, links[i].Y, 4, 0, Math.PI * 2, true);
                    }
                    ctx.fill(arcPath);
                    ctx.stroke(arcPath);
                }

                window.requestAnimationFrame(draw);
            }

            init();

        });
    }


}
(function(){
	'use strict';
	angular.module('sm.adminCreate',[]);
})();
(function(){

	angular
		.module('sm.adminCreate')
		.run(appRun);

		function appRun(routerHelper){
			routerHelper.configureStates(getStates());
		};

		function getStates(){
			return [
				{
					state: 'admincreate',
					config: {
						url: '/',
						controller: 'AdminCreateController',
						templateUrl: 'client/components/admin/create/admin.create.html'
					}
				}
			]
		}

})();
(function(){

    angular
        .module('sm.adminCreate')
        .factory('AdminFactory', AdminFactory);

    AdminFactory.$inject = ['Upload','FIREBASE_URI'];


    function AdminFactory(Upload){

        function uploadImg(file){
            console.log(file, "factory")
            return Upload.upload({
                url:"/api/upload/image",
                file:file
            })
        };

        return {
            uploadImg: uploadImg
        }

    }

})();
(function(){

	angular
	.module('sm.adminCreate')
	.controller('AdminCreateController', AdminCreateController);

	AdminCreateController.$inject = ['$scope', '$stateParams', '$state', '$rootScope','AdminFactory', '$firebaseObject','$firebaseArray','FIREBASE_URI'];

	function AdminCreateController($scope, $stateParams, $state, $rootScope, AdminFactory, $firebaseObject, $firebaseArray, FIREBASE_URI){
		var eventRef = new Firebase(FIREBASE_URI + 'Session');

		//instatiate session object and add to $scope
		$scope.session = {
			// name: "",
			// category: "",
			desc: ""
			// budget: "",
			// address: "",
			// imgUrl:""
		};


		$scope.sessions = $firebaseArray(eventRef);

		$scope.submitSession = function(session){
			$scope.sessions.$add(session);
			$scope.session ={};
			$scope.upload ="";
			$state.go('ideas');
		};

		//watch file for change, do stuff and trigger factory Func.
		// $scope.$watch('file', function(file){
		// 	if(file){
		// 		$scope.loading = true;

		// 		AdminFactory.uploadImg($scope.file).then(function(data){
		// 			$scope.loading = false;
		// 			console.log(data, "data");
		// 			$scope.upload = data;

		// //get path on callback from AWS
		// var initial_path ="https://s3-us-west-2.amazonaws.com/supermesh/";
		// //this is necessary because of the way AWS formats spaces "+"
		// $scope.session.imgUrl = initial_path + data.data.split(' ').join('+');

		// });
		// 	}
		// })

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

    angular.module('sm.signup', []);
})();
(function(){
	'use strict';
	angular
	.module('sm.signup')
	.run(appRun)

	function appRun(routerHelper){
		routerHelper.configureStates(getStates());
	}

	function getStates(){

		return [
		{
			state: 'signup',
			config: {
				url: '/signup',
				controller:"signUpCtrl",
				templateUrl: 'client/components/signup/signup.html'
			}
		}
		]
	}
})();
(function() {
    'use strict';

    angular
        .module('sm.signup')
        .controller('signUpCtrl', signUpCtrl);

    signUpCtrl.$inject = ['$scope','$state', '$rootScope','$firebaseAuth', 'FIREBASE_URI'];

    function signUpCtrl($scope, $state,$rootScope, $firebaseAuth, FIREBASE_URI) {

        var ref = new Firebase(FIREBASE_URI +'Admin');
        var authObj = $firebaseAuth(ref);

        $scope.signUpUser = function (email, password) {

            authObj.$createUser({
                email: email,
                password: password
            }).then(function(userData) {
                console.log("User " + userData.uid + " created successfully!");

                return authObj.$authWithPassword({
                    email: email,
                    password: password
                });
            }).then(function(authData) {
                console.log("Logged in as:", authData.uid);
                $rootScope.authData = authData;
                $state.go('admin');
            }).catch(function(error) {
                console.error("Error: ", error);
                $scope.error =error;
                $scope.email ="";
                $scope.password ="";
                $state.go('signup');
            });
        }

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
				url: '/signin',
				controller:"signInCtrl",
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

    signInCtrl.$inject = ['$scope','$state', '$rootScope', '$firebaseAuth', 'FIREBASE_URI'];

    function signInCtrl($scope, $state,$rootScope, $firebaseAuth, FIREBASE_URI) {

        var ref = new Firebase(FIREBASE_URI +'Admin');
        var adminObj = $firebaseAuth(ref);

        $scope.authEmailUser = function (email, password) {

            adminObj.$authWithPassword({
                password: password,
                email: email
            }).then(function (authData) {
                console.log("Logged in as:", authData.uid);
                $rootScope.authData = authData;
                $state.go('admin');



            }).catch(function (error) {
                console.error("Authentication failed:", error);
                $scope.error =error;
                $scope.email ="";
                $scope.password ="";
                $state.go('signin');
            });
        }





        // now, redirect only not authenticated

        //var userInfo = authenticationSvc.getUserInfo();
        //
        //if(userInfo.authenticated === false) {
        //    e.preventDefault(); // stop current execution
        //    $state.go('login'); // go to login
        //}

    }
})();
(function(){
	'use strict';
	angular
	.module('sm.participant')
	.run(appRun)

	function appRun(routerHelper){
		routerHelper.configureStates(getStates());
	}

	function getStates(){

		return [
		{
			state: 'participant',
			config: {
				url: '/participant',
				templateUrl: 'client/components/participant/participant.html'
			}
		}
		]
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
					state: 'ideas',
					config: {
						url: '/ideas',
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

		AdminController.$inject = ['$scope','$rootScope','$firebaseObject','$firebaseArray','FIREBASE_URI'];

		function AdminController($scope, $rootScope, $firebaseObject, $firebaseArray, FIREBASE_URI){
			var eventRef = new Firebase(FIREBASE_URI + 'Session');

            //instatiate session object and add to $scope
            $scope.session = {
                name:"",
                presenter:"",
                desc:"",
                time:"",
                imgUrl:""
            };


			$scope.sessions = $firebaseArray(eventRef);


		}

})();
(function () {
	'use strict';
	angular.module('sm.event', []);
})();
(function(){
	'use strict';
	angular
		.module('sm.event')
		.run(appRun)

		function appRun(routerHelper){
			routerHelper.configureStates(getStates());
		};

		function getStates(){
			return [
				{
					state: 'event',
					config: {
						url: '/event',
						controller: 'eventController',
						templateUrl: 'client/components/event/event.html'
					}
				}
			];
		};

})();
(function() {
	'use strict';
	angular
		.module('sm.event')
		.controller('eventController', eventController);

		eventController.$inject = ['$scope', '$firebaseArray', 'FIREBASE_URI'];

		function eventController ($scope, $firebaseArray, FIREBASE_URI) {
			var eventRef = new Firebase(FIREBASE_URI + 'Session');
			$scope.event = $firebaseArray(eventRef);
			console.log($scope.event, "event for participants");
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

        $scope.user = 0;
        $scope.voteArr = [];

        //create anon user with uid and limit session to browser open only.
        $scope.authAnonUser= function(username){
            chatRef.authAnonymously(function(error, authData) {
                if (error) {
                   console.log("Authentication Failed!", error);
                   $scope.user = false;
                } else {
                   userRef.push({id:authData.uid, name:username, token:authData.token});
                   console.log("Logged in as:", authData);
                   $scope.error = false;
                   $scope.$apply(function() {
                        $scope.user = authData;
                        $scope.username = username;
                    })
                }
            }, 
            {
                remember: "session"
            }
        );
    }

    $scope.messages = $firebaseArray(chatRef);

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

    // Custom Filter

    //Upvote function
    $scope.error= false;
    $scope.voted = false;

    $scope.upVote = function(index, message){
        if(!$scope.user){
            $scope.error =true;
        } else {
            // console.log($scope.user.uid, "UID");
            if (!message.votes) {
                message.votes = {};
            }
            // console.log(message.votes[$scope.user.auth.uid]);
            message.votes[$scope.user.auth.uid] = !($scope.user.auth.uid in message.votes) ? 0 : message.votes[$scope.user.auth.uid] + 1;
            message.votecount = Object.keys(message.votes).length;
            $scope.voteArr.push(message.votecount);
            $scope.messages.$save(index);
        }
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
        'ngFileUpload',

        /*
         * Feature areas
         */
         
        'sm.admin',
        'sm.adminCreate',
        'sm.cc',
        'sm.chat',
        'sm.session',
        'sm.signin',
        'sm.signup',
        'sm.event',
        'sm.participant',
        'sm.signin'
    ]);

})();
(function() {
    'use strict';

    angular.module('sm.firebase',[])
    	.constant('FIREBASE_URI', 'https://luminous-inferno-640.firebaseio.com');

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlc3Npb24vc2Vzc2lvbi5tb2R1bGUuanMiLCJzZXNzaW9uL3ZpZXcvc2Vzc2lvbi52aWV3LnJvdXRlcy5qcyIsInNlc3Npb24vdmlldy9zZXNzaW9uLnZpZXcuY29udHJvbGxlci5qcyIsInNlc3Npb24vdGlsZS9zZXNzaW9uLnRpbGUuZGlyZWN0aXZlLmpzIiwicGFydGljaXBhbnQvcGFydGljaXBhbnQubW9kdWxlLmpzIiwicGFydGljaXBhbnQvbWVzaHBvaW50cy9tZXNocHRzLmRpcmVjdGl2ZS5qcyIsImFkbWluL2NyZWF0ZS9hZG1pbi5jcmVhdGUubW9kdWxlLmpzIiwiYWRtaW4vY3JlYXRlL2FkbWluLmNyZWF0ZS5yb3V0ZXMuanMiLCJhZG1pbi9jcmVhdGUvYWRtaW4uY3JlYXRlLmZhY3RvcnkuanMiLCJhZG1pbi9jcmVhdGUvYWRtaW4uY3JlYXRlLmNvbnRyb2xsZXIuanMiLCJjb3JlL3JvdXRlci9yb3V0ZXIubW9kdWxlLmpzIiwiY29yZS9yb3V0ZXIvcm91dGVyLnByb3ZpZGVyLmpzIiwiY29tbW9uL2NjLm1vZHVsZS5qcyIsImNvbW1vbi9uYXZiYXIvbmF2YmFyLmRpcmVjdGl2ZS5qcyIsInNpZ251cC9zaWdudXAubW9kdWxlLmpzIiwic2lnbnVwL3NpZ251cC5yb3V0ZXMuanMiLCJzaWdudXAvc2lnbnVwLmNvbnRyb2xsZXIuanMiLCJzaWduaW4vc2lnbmluLm1vZHVsZS5qcyIsInNpZ25pbi9zaWduaW4ucm91dGVzLmpzIiwic2lnbmluL3NpZ25pbi5jb250cm9sbGVyLmpzIiwicGFydGljaXBhbnQvcGFydGljaXBhbnQucm91dGVzLmpzIiwiYWRtaW4vYWRtaW4ubW9kdWxlLmpzIiwiYWRtaW4vYWRtaW4ucm91dGVzLmpzIiwiYWRtaW4vYWRtaW4uY29udHJvbGxlci5qcyIsImV2ZW50L2V2ZW50Lm1vZHVsZS5qcyIsImV2ZW50L2V2ZW50LnJvdXRlcy5qcyIsImV2ZW50L2V2ZW50LmNvbnRyb2xsZXIuanMiLCJjb3JlL2NvcmUubW9kdWxlLmpzIiwiY29yZS9kYXRhc2VydmljZS5qcyIsImNvcmUvY29yZS5yb3V0ZS5qcyIsImNoYXQvY2hhdC5tb2R1bGUuanMiLCJjaGF0L2NoYXQuZGlyLmpzIiwiY2hhdC9jaGF0LmN0cmwuanMiLCJzbS5tb2R1bGUuanMiLCJzbS5maXJlYmFzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3NtLnNlc3Npb24nLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdzbS5zZXNzaW9uJylcblx0XHQucnVuKGFwcFJ1bilcblxuXHRcdGZ1bmN0aW9uIGFwcFJ1bihyb3V0ZXJIZWxwZXIpe1xuXHRcdFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSk7XG5cdFx0fVxuXG5cdFx0Ly8gZ2V0U3RhdGVzLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyRzdGF0ZVBhcmFtcyddO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0U3RhdGVzKCl7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RhdGU6ICdzZXNzaW9uJyxcblx0XHRcdFx0XHRjb25maWc6IHtcblx0XHRcdFx0XHRcdHVybDogJy9zZXNzaW9uLzppZCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2Vzc2lvbkNvbnRyb2xsZXInLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9zZXNzaW9uL3ZpZXcvc2Vzc2lvbi52aWV3Lmh0bWwnLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRzZXNzaW9uSUQ6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAkc3RhdGVQYXJhbXMuaWQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdF07XG5cdFx0fTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3NtLnNlc3Npb24nKVxuXHRcdC5jb250cm9sbGVyKCdTZXNzaW9uQ29udHJvbGxlcicsIFNlc3Npb25Db250cm9sbGVyKTtcblxuXHRcdFNlc3Npb25Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdzZXNzaW9uSUQnLCAnJGZpcmViYXNlT2JqZWN0JywgJ0ZJUkVCQVNFX1VSSSddO1xuXG5cdFx0ZnVuY3Rpb24gU2Vzc2lvbkNvbnRyb2xsZXIoJHNjb3BlLCBzZXNzaW9uSUQsICRmaXJlYmFzZU9iamVjdCwgRklSRUJBU0VfVVJJKSB7XG5cdFx0XHQkc2NvcGUuc2Vzc2lvbklEID0gc2Vzc2lvbklEO1xuXHRcdFx0dmFyIHNlc3Npb25SZWYgPSBuZXcgRmlyZWJhc2UoRklSRUJBU0VfVVJJICsgJ1Nlc3Npb24nICsgJy8nICsgc2Vzc2lvbklEKTtcblx0XHRcdCRzY29wZS5zZXNzaW9uID0gJGZpcmViYXNlT2JqZWN0KHNlc3Npb25SZWYpO1xuXHRcdFx0JHNjb3BlLnZvdGUgPSAwO1xuXHRcdFx0JHNjb3BlLnNlc3Npb25Wb3RlID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLnZvdGUgKytcblx0XHRcdH1cblxuXHRcdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uc2Vzc2lvbicpXG5cdFx0LmRpcmVjdGl2ZSgnc2Vzc2lvblRpbGUnLCBzZXNzaW9uVGlsZSk7XG5cblx0XHRmdW5jdGlvbiBzZXNzaW9uVGlsZSgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdFx0J3Nlc3Npb24nOiAnPSdcblx0XHRcdFx0fSxcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9zZXNzaW9uL3RpbGUvc2Vzc2lvbi50aWxlLmh0bWwnXG5cdFx0XHR9XG5cdFx0fVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc20ucGFydGljaXBhbnQnLCBbXSk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NtLnBhcnRpY2lwYW50JylcbiAgICAuZGlyZWN0aXZlKCdwYXJ0aWNpcGFudEltZycsIHBhcnRpY2lwYW50SW1nKTtcblxuZnVuY3Rpb24gcGFydGljaXBhbnRJbWcoKXtcblx0XHR2YXIgZGlyZWN0aXZlID0ge1xuXHRcdFx0bGluazogbGluayxcbiAgICAgIHRlbXBsYXRlVXJsOicvY2xpZW50L2NvbXBvbmVudHMvcGFydGljaXBhbnQvbWVzaHBvaW50cy9tZXNocHRzLmh0bWwnLFxuICAgIFx0cmVzdHJpY3Q6ICdFJ1xuICAgIH07XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgXHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsaW5rcyA9IFtdO1xuICAgICAgICAgICAgdmFyIGxpbmtzX2NvdW50ID0gMzI7XG4gICAgICAgICAgICB2YXIgY29ubmVjdHNfdGltZSA9IDI0MDtcbiAgICAgICAgICAgIHZhciBjb25uZWN0c19jb3VudCA9IDI7XG4gICAgICAgICAgICB2YXIgdGhlbWVfc3RhcnQgPSB7IFg6MTUwLCBZOjE1MCwgVzozMDAsIEg6MzAwIH07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpbWl0X251bWJlcihtaW4sIGN1ciwgbWF4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1ciA8IG1pbikgcmV0dXJuIG1pbjtcbiAgICAgICAgICAgICAgICBpZiAoY3VyID4gbWF4KSByZXR1cm4gbWF4O1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHByaW50X3JnYmEociwgZywgYiwgYSkgeyByZXR1cm4gXCJyZ2JhKFwiK3IrXCIsXCIrZytcIixcIitiK1wiLFwiK2ErXCIpXCI7IH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gTGlua2VyKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgY29ubmVjdHMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7aTxjb25uZWN0c19jb3VudDtpKyspIGNvbm5lY3RzLnB1c2goQ29ubmVjdG9yKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFydF94ID0gTWF0aC5yYW5kb20oKSAqIHRoZW1lX3N0YXJ0Llc7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0X3kgPSBNYXRoLnJhbmRvbSgpICogdGhlbWVfc3RhcnQuSDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIFg6IHN0YXJ0X3gsXG4gICAgICAgICAgICAgICAgICAgIFk6IHN0YXJ0X3ksXG4gICAgICAgICAgICAgICAgICAgIFRYOiBzdGFydF94LFxuICAgICAgICAgICAgICAgICAgICBUWTogc3RhcnRfeSxcbiAgICAgICAgICAgICAgICAgICAgTmV3Sm9iOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0eCA9IHRoaXMuWCArIE1hdGgucmFuZG9tKCkgKiAyMDAgLSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHkgPSB0aGlzLlkgKyBNYXRoLnJhbmRvbSgpICogMjAwIC0gMTAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlRYID0gbGltaXRfbnVtYmVyKE1hdGgucmFuZG9tKCkgKiA1MCwgdHgsIHRoZW1lX3N0YXJ0LlcgLSBNYXRoLnJhbmRvbSgpICogNTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5UWSA9IGxpbWl0X251bWJlcihNYXRoLnJhbmRvbSgpICogNTAsIHR5LCB0aGVtZV9zdGFydC5IIC0gTWF0aC5yYW5kb20oKSAqIDUwKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgTW92aW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh0aGlzLlRYIC0gdGhpcy5YLCAyKSArIE1hdGgucG93KHRoaXMuVFkgLSB0aGlzLlksIDIpKSA+IDE7IH0sXG4gICAgICAgICAgICAgICAgICAgIENvbm5lY3RvcnM6IGNvbm5lY3RzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gQ29ubmVjdG9yKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcbiAgICAgICAgICAgICAgICAgICAgVGltZTotMSxcbiAgICAgICAgICAgICAgICAgICAgVGFyZ2V0Om51bGwsXG4gICAgICAgICAgICAgICAgICAgIE5ld0pvYjpmdW5jdGlvbigpeyB0aGlzLlRhcmdldCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxpbmtzX2NvdW50KTsgdGhpcy5UaW1lID0gTWF0aC5yYW5kb20oKSAqIGNvbm5lY3RzX3RpbWU7IH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlua3NfY291bnQ7IGkrKykgbGlua3MucHVzaChMaW5rZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRyYXcoKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlua3NfY291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWxpbmtzW2ldLk1vdmluZygpKSBsaW5rc1tpXS5OZXdKb2IoKTtcbiAgICAgICAgICAgICAgICAgICAgbGlua3NbaV0uWCArPSAobGlua3NbaV0uVFggLSBsaW5rc1tpXS5YKSAvIDI0O1xuICAgICAgICAgICAgICAgICAgICBsaW5rc1tpXS5ZICs9IChsaW5rc1tpXS5UWSAtIGxpbmtzW2ldLlkpIC8gMjQ7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBqPTA7ajxsaW5rc1tpXS5Db25uZWN0b3JzLmxlbmd0aDtqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rc1tpXS5Db25uZWN0b3JzW2pdLlRpbWUgPCAwKSBsaW5rc1tpXS5Db25uZWN0b3JzW2pdLk5ld0pvYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlua3NbaV0uQ29ubmVjdG9yc1tqXS5UaW1lIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZyYW1lJyk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnZhcy5nZXRDb250ZXh0KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IDMwMDtcblxuICAgICAgICAgICAgICAgICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW92ZXInO1xuICAgICAgICAgICAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoZW1lX3N0YXJ0LlcsIHRoZW1lX3N0YXJ0LkgpO1xuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcIiNDMEJGQkVcIjtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiI0MwQkZCRVwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxsaW5rc19jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGo9MDtqPGxpbmtzW2ldLkNvbm5lY3RvcnMubGVuZ3RoO2orKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb25uZWN0ID0gbGlua3NbbGlua3NbaV0uQ29ubmVjdG9yc1tqXS5UYXJnZXRdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmVzUGF0aCA9IG5ldyBQYXRoMkQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1BhdGgubW92ZVRvKGxpbmtzW2ldLlgsIGxpbmtzW2ldLlkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzUGF0aC5saW5lVG8oY29ubmVjdC5YLCBjb25uZWN0LlkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHByaW50X3JnYmEoOTgsIDk4LCA5OCwgbGltaXRfbnVtYmVyKC4zLCBsaW5rc1tpXS5Db25uZWN0b3JzW2pdLlRpbWUgLyAxMDAsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKGxpbmVzUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJjUGF0aCA9IG5ldyBQYXRoMkQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGxpbmtzX2NvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY1BhdGgubW92ZVRvKGxpbmtzW2ldLlgsIGxpbmtzW2ldLlkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJjUGF0aC5hcmMobGlua3NbaV0uWCwgbGlua3NbaV0uWSwgNCwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsKGFyY1BhdGgpO1xuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKGFyY1BhdGgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluaXQoKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cblxufSIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXIubW9kdWxlKCdzbS5hZG1pbkNyZWF0ZScsW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uYWRtaW5DcmVhdGUnKVxuXHRcdC5ydW4oYXBwUnVuKTtcblxuXHRcdGZ1bmN0aW9uIGFwcFJ1bihyb3V0ZXJIZWxwZXIpe1xuXHRcdFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldFN0YXRlcygpe1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0YXRlOiAnYWRtaW5jcmVhdGUnLFxuXHRcdFx0XHRcdGNvbmZpZzoge1xuXHRcdFx0XHRcdFx0dXJsOiAnLycsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQWRtaW5DcmVhdGVDb250cm9sbGVyJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnY2xpZW50L2NvbXBvbmVudHMvYWRtaW4vY3JlYXRlL2FkbWluLmNyZWF0ZS5odG1sJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnc20uYWRtaW5DcmVhdGUnKVxuICAgICAgICAuZmFjdG9yeSgnQWRtaW5GYWN0b3J5JywgQWRtaW5GYWN0b3J5KTtcblxuICAgIEFkbWluRmFjdG9yeS4kaW5qZWN0ID0gWydVcGxvYWQnLCdGSVJFQkFTRV9VUkknXTtcblxuXG4gICAgZnVuY3Rpb24gQWRtaW5GYWN0b3J5KFVwbG9hZCl7XG5cbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkSW1nKGZpbGUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coZmlsZSwgXCJmYWN0b3J5XCIpXG4gICAgICAgICAgICByZXR1cm4gVXBsb2FkLnVwbG9hZCh7XG4gICAgICAgICAgICAgICAgdXJsOlwiL2FwaS91cGxvYWQvaW1hZ2VcIixcbiAgICAgICAgICAgICAgICBmaWxlOmZpbGVcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVwbG9hZEltZzogdXBsb2FkSW1nXG4gICAgICAgIH1cblxuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuXHRhbmd1bGFyXG5cdC5tb2R1bGUoJ3NtLmFkbWluQ3JlYXRlJylcblx0LmNvbnRyb2xsZXIoJ0FkbWluQ3JlYXRlQ29udHJvbGxlcicsIEFkbWluQ3JlYXRlQ29udHJvbGxlcik7XG5cblx0QWRtaW5DcmVhdGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJHN0YXRlJywgJyRyb290U2NvcGUnLCdBZG1pbkZhY3RvcnknLCAnJGZpcmViYXNlT2JqZWN0JywnJGZpcmViYXNlQXJyYXknLCdGSVJFQkFTRV9VUkknXTtcblxuXHRmdW5jdGlvbiBBZG1pbkNyZWF0ZUNvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgJHJvb3RTY29wZSwgQWRtaW5GYWN0b3J5LCAkZmlyZWJhc2VPYmplY3QsICRmaXJlYmFzZUFycmF5LCBGSVJFQkFTRV9VUkkpe1xuXHRcdHZhciBldmVudFJlZiA9IG5ldyBGaXJlYmFzZShGSVJFQkFTRV9VUkkgKyAnU2Vzc2lvbicpO1xuXG5cdFx0Ly9pbnN0YXRpYXRlIHNlc3Npb24gb2JqZWN0IGFuZCBhZGQgdG8gJHNjb3BlXG5cdFx0JHNjb3BlLnNlc3Npb24gPSB7XG5cdFx0XHQvLyBuYW1lOiBcIlwiLFxuXHRcdFx0Ly8gY2F0ZWdvcnk6IFwiXCIsXG5cdFx0XHRkZXNjOiBcIlwiXG5cdFx0XHQvLyBidWRnZXQ6IFwiXCIsXG5cdFx0XHQvLyBhZGRyZXNzOiBcIlwiLFxuXHRcdFx0Ly8gaW1nVXJsOlwiXCJcblx0XHR9O1xuXG5cblx0XHQkc2NvcGUuc2Vzc2lvbnMgPSAkZmlyZWJhc2VBcnJheShldmVudFJlZik7XG5cblx0XHQkc2NvcGUuc3VibWl0U2Vzc2lvbiA9IGZ1bmN0aW9uKHNlc3Npb24pe1xuXHRcdFx0JHNjb3BlLnNlc3Npb25zLiRhZGQoc2Vzc2lvbik7XG5cdFx0XHQkc2NvcGUuc2Vzc2lvbiA9e307XG5cdFx0XHQkc2NvcGUudXBsb2FkID1cIlwiO1xuXHRcdFx0JHN0YXRlLmdvKCdpZGVhcycpO1xuXHRcdH07XG5cblx0XHQvL3dhdGNoIGZpbGUgZm9yIGNoYW5nZSwgZG8gc3R1ZmYgYW5kIHRyaWdnZXIgZmFjdG9yeSBGdW5jLlxuXHRcdC8vICRzY29wZS4kd2F0Y2goJ2ZpbGUnLCBmdW5jdGlvbihmaWxlKXtcblx0XHQvLyBcdGlmKGZpbGUpe1xuXHRcdC8vIFx0XHQkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cblx0XHQvLyBcdFx0QWRtaW5GYWN0b3J5LnVwbG9hZEltZygkc2NvcGUuZmlsZSkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHQvLyBcdFx0XHQkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXHRcdC8vIFx0XHRcdGNvbnNvbGUubG9nKGRhdGEsIFwiZGF0YVwiKTtcblx0XHQvLyBcdFx0XHQkc2NvcGUudXBsb2FkID0gZGF0YTtcblxuXHRcdC8vIC8vZ2V0IHBhdGggb24gY2FsbGJhY2sgZnJvbSBBV1Ncblx0XHQvLyB2YXIgaW5pdGlhbF9wYXRoID1cImh0dHBzOi8vczMtdXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vc3VwZXJtZXNoL1wiO1xuXHRcdC8vIC8vdGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBvZiB0aGUgd2F5IEFXUyBmb3JtYXRzIHNwYWNlcyBcIitcIlxuXHRcdC8vICRzY29wZS5zZXNzaW9uLmltZ1VybCA9IGluaXRpYWxfcGF0aCArIGRhdGEuZGF0YS5zcGxpdCgnICcpLmpvaW4oJysnKTtcblxuXHRcdC8vIH0pO1xuXHRcdC8vIFx0fVxuXHRcdC8vIH0pXG5cblx0fVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXIubW9kdWxlKCdzbS5yb3V0ZXInLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdzbS5yb3V0ZXInKVxuICAgICAgICAucHJvdmlkZXIoJ3JvdXRlckhlbHBlcicsIHJvdXRlckhlbHBlclByb3ZpZGVyKTtcblxuICAgICAgICByb3V0ZXJIZWxwZXJQcm92aWRlci4kaW5qZWN0ID0gWyckbG9jYXRpb25Qcm92aWRlcicsICckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInXTtcblxuICAgICAgICBmdW5jdGlvbiByb3V0ZXJIZWxwZXJQcm92aWRlcigkbG9jYXRpb25Qcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAgICAgLyoganNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgICAgICB0aGlzLiRnZXQgPSBSb3V0ZXJIZWxwZXI7XG5cbiAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblxuICAgICAgICAgICAgUm91dGVySGVscGVyLiRpbmplY3QgPSBbJyRzdGF0ZSddO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBSb3V0ZXJIZWxwZXIoJHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc090aGVyd2lzZSA9IGZhbHNlO1xuXG5cblxuICAgICAgICAgICAgICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmVTdGF0ZXM6IGNvbmZpZ3VyZVN0YXRlcyxcbiAgICAgICAgICAgICAgICAgICAgZ2V0U3RhdGVzOiBnZXRTdGF0ZXNcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICAgICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNvbmZpZ3VyZVN0YXRlcyhzdGF0ZXMsIG90aGVyd2lzZVBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVzLmZvckVhY2goZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHN0YXRlLnN0YXRlLCBzdGF0ZS5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyd2lzZVBhdGggJiYgIWhhc090aGVyd2lzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzT3RoZXJ3aXNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2Uob3RoZXJ3aXNlUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRTdGF0ZXMoKSB7IHJldHVybiAkc3RhdGUuZ2V0KCk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnc20uY2MnLFtdKTtcblx0XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3NtLmNjJylcblx0XHQuZGlyZWN0aXZlKCduYXZCYXInLCBuYXZCYXIpO1xuXG5cdGZ1bmN0aW9uIG5hdkJhcigpIHtcblxuXHRcdHZhciBkaXJlY3RpdmUgPSB7XG5cdFx0XHR0ZW1wbGF0ZVVybDogJ2NsaWVudC9jb21wb25lbnRzL2NvbW1vbi9uYXZiYXIvbmF2YmFyLmh0bWwnLFxuXHRcdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdH1cblxuXHRcdHJldHVybiBkaXJlY3RpdmU7XG5cdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NtLnNpZ251cCcsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0Jztcblx0YW5ndWxhclxuXHQubW9kdWxlKCdzbS5zaWdudXAnKVxuXHQucnVuKGFwcFJ1bilcblxuXHRmdW5jdGlvbiBhcHBSdW4ocm91dGVySGVscGVyKXtcblx0XHRyb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKGdldFN0YXRlcygpKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldFN0YXRlcygpe1xuXG5cdFx0cmV0dXJuIFtcblx0XHR7XG5cdFx0XHRzdGF0ZTogJ3NpZ251cCcsXG5cdFx0XHRjb25maWc6IHtcblx0XHRcdFx0dXJsOiAnL3NpZ251cCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6XCJzaWduVXBDdHJsXCIsXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnY2xpZW50L2NvbXBvbmVudHMvc2lnbnVwL3NpZ251cC5odG1sJ1xuXHRcdFx0fVxuXHRcdH1cblx0XHRdXG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnc20uc2lnbnVwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3NpZ25VcEN0cmwnLCBzaWduVXBDdHJsKTtcblxuICAgIHNpZ25VcEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywnJHN0YXRlJywgJyRyb290U2NvcGUnLCckZmlyZWJhc2VBdXRoJywgJ0ZJUkVCQVNFX1VSSSddO1xuXG4gICAgZnVuY3Rpb24gc2lnblVwQ3RybCgkc2NvcGUsICRzdGF0ZSwkcm9vdFNjb3BlLCAkZmlyZWJhc2VBdXRoLCBGSVJFQkFTRV9VUkkpIHtcblxuICAgICAgICB2YXIgcmVmID0gbmV3IEZpcmViYXNlKEZJUkVCQVNFX1VSSSArJ0FkbWluJyk7XG4gICAgICAgIHZhciBhdXRoT2JqID0gJGZpcmViYXNlQXV0aChyZWYpO1xuXG4gICAgICAgICRzY29wZS5zaWduVXBVc2VyID0gZnVuY3Rpb24gKGVtYWlsLCBwYXNzd29yZCkge1xuXG4gICAgICAgICAgICBhdXRoT2JqLiRjcmVhdGVVc2VyKHtcbiAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHVzZXJEYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIFwiICsgdXNlckRhdGEudWlkICsgXCIgY3JlYXRlZCBzdWNjZXNzZnVsbHkhXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF1dGhPYmouJGF1dGhXaXRoUGFzc3dvcmQoe1xuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihhdXRoRGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9nZ2VkIGluIGFzOlwiLCBhdXRoRGF0YS51aWQpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuYXV0aERhdGEgPSBhdXRoRGF0YTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkbWluJyk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPWVycm9yO1xuICAgICAgICAgICAgICAgICRzY29wZS5lbWFpbCA9XCJcIjtcbiAgICAgICAgICAgICAgICAkc2NvcGUucGFzc3dvcmQgPVwiXCI7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdzaWdudXAnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc20uc2lnbmluJywgW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnO1xuXHRhbmd1bGFyXG5cdC5tb2R1bGUoJ3NtLnNpZ25pbicpXG5cdC5ydW4oYXBwUnVuKVxuXG5cdGZ1bmN0aW9uIGFwcFJ1bihyb3V0ZXJIZWxwZXIpe1xuXHRcdHJvdXRlckhlbHBlci5jb25maWd1cmVTdGF0ZXMoZ2V0U3RhdGVzKCkpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0U3RhdGVzKCl7XG5cblx0XHRyZXR1cm4gW1xuXHRcdHtcblx0XHRcdHN0YXRlOiAnc2lnbmluJyxcblx0XHRcdGNvbmZpZzoge1xuXHRcdFx0XHR1cmw6ICcvc2lnbmluJyxcblx0XHRcdFx0Y29udHJvbGxlcjpcInNpZ25JbkN0cmxcIixcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9zaWduaW4vc2lnbmluLmh0bWwnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdF1cblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdzbS5zaWduaW4nKVxuICAgICAgICAuY29udHJvbGxlcignc2lnbkluQ3RybCcsIHNpZ25JbkN0cmwpO1xuXG4gICAgc2lnbkluQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCckc3RhdGUnLCAnJHJvb3RTY29wZScsICckZmlyZWJhc2VBdXRoJywgJ0ZJUkVCQVNFX1VSSSddO1xuXG4gICAgZnVuY3Rpb24gc2lnbkluQ3RybCgkc2NvcGUsICRzdGF0ZSwkcm9vdFNjb3BlLCAkZmlyZWJhc2VBdXRoLCBGSVJFQkFTRV9VUkkpIHtcblxuICAgICAgICB2YXIgcmVmID0gbmV3IEZpcmViYXNlKEZJUkVCQVNFX1VSSSArJ0FkbWluJyk7XG4gICAgICAgIHZhciBhZG1pbk9iaiA9ICRmaXJlYmFzZUF1dGgocmVmKTtcblxuICAgICAgICAkc2NvcGUuYXV0aEVtYWlsVXNlciA9IGZ1bmN0aW9uIChlbWFpbCwgcGFzc3dvcmQpIHtcblxuICAgICAgICAgICAgYWRtaW5PYmouJGF1dGhXaXRoUGFzc3dvcmQoe1xuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGF1dGhEYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2dnZWQgaW4gYXM6XCIsIGF1dGhEYXRhLnVpZCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hdXRoRGF0YSA9IGF1dGhEYXRhO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRtaW4nKTtcblxuXG5cbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJBdXRoZW50aWNhdGlvbiBmYWlsZWQ6XCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPWVycm9yO1xuICAgICAgICAgICAgICAgICRzY29wZS5lbWFpbCA9XCJcIjtcbiAgICAgICAgICAgICAgICAkc2NvcGUucGFzc3dvcmQgPVwiXCI7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdzaWduaW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuXG5cblxuICAgICAgICAvLyBub3csIHJlZGlyZWN0IG9ubHkgbm90IGF1dGhlbnRpY2F0ZWRcblxuICAgICAgICAvL3ZhciB1c2VySW5mbyA9IGF1dGhlbnRpY2F0aW9uU3ZjLmdldFVzZXJJbmZvKCk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vaWYodXNlckluZm8uYXV0aGVudGljYXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgLy8gICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBzdG9wIGN1cnJlbnQgZXhlY3V0aW9uXG4gICAgICAgIC8vICAgICRzdGF0ZS5nbygnbG9naW4nKTsgLy8gZ28gdG8gbG9naW5cbiAgICAgICAgLy99XG5cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXJcblx0Lm1vZHVsZSgnc20ucGFydGljaXBhbnQnKVxuXHQucnVuKGFwcFJ1bilcblxuXHRmdW5jdGlvbiBhcHBSdW4ocm91dGVySGVscGVyKXtcblx0XHRyb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKGdldFN0YXRlcygpKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldFN0YXRlcygpe1xuXG5cdFx0cmV0dXJuIFtcblx0XHR7XG5cdFx0XHRzdGF0ZTogJ3BhcnRpY2lwYW50Jyxcblx0XHRcdGNvbmZpZzoge1xuXHRcdFx0XHR1cmw6ICcvcGFydGljaXBhbnQnLFxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2NsaWVudC9jb21wb25lbnRzL3BhcnRpY2lwYW50L3BhcnRpY2lwYW50Lmh0bWwnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdF1cblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnO1xuXHRhbmd1bGFyLm1vZHVsZSgnc20uYWRtaW4nLFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3NtLmFkbWluJylcblx0XHQucnVuKGFwcFJ1bik7XG5cblx0XHRmdW5jdGlvbiBhcHBSdW4ocm91dGVySGVscGVyKXtcblx0XHRcdHJvdXRlckhlbHBlci5jb25maWd1cmVTdGF0ZXMoZ2V0U3RhdGVzKCkpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXRTdGF0ZXMoKXtcblx0XHRcdHJldHVybiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzdGF0ZTogJ2lkZWFzJyxcblx0XHRcdFx0XHRjb25maWc6IHtcblx0XHRcdFx0XHRcdHVybDogJy9pZGVhcycsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnQWRtaW5Db250cm9sbGVyJyxcblx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAnY2xpZW50L2NvbXBvbmVudHMvYWRtaW4vYWRtaW4uaHRtbCdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHR9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3NtLmFkbWluJylcblx0XHQuY29udHJvbGxlcignQWRtaW5Db250cm9sbGVyJywgQWRtaW5Db250cm9sbGVyKTtcblxuXHRcdEFkbWluQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCckcm9vdFNjb3BlJywnJGZpcmViYXNlT2JqZWN0JywnJGZpcmViYXNlQXJyYXknLCdGSVJFQkFTRV9VUkknXTtcblxuXHRcdGZ1bmN0aW9uIEFkbWluQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsICRmaXJlYmFzZU9iamVjdCwgJGZpcmViYXNlQXJyYXksIEZJUkVCQVNFX1VSSSl7XG5cdFx0XHR2YXIgZXZlbnRSZWYgPSBuZXcgRmlyZWJhc2UoRklSRUJBU0VfVVJJICsgJ1Nlc3Npb24nKTtcblxuICAgICAgICAgICAgLy9pbnN0YXRpYXRlIHNlc3Npb24gb2JqZWN0IGFuZCBhZGQgdG8gJHNjb3BlXG4gICAgICAgICAgICAkc2NvcGUuc2Vzc2lvbiA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOlwiXCIsXG4gICAgICAgICAgICAgICAgcHJlc2VudGVyOlwiXCIsXG4gICAgICAgICAgICAgICAgZGVzYzpcIlwiLFxuICAgICAgICAgICAgICAgIHRpbWU6XCJcIixcbiAgICAgICAgICAgICAgICBpbWdVcmw6XCJcIlxuICAgICAgICAgICAgfTtcblxuXG5cdFx0XHQkc2NvcGUuc2Vzc2lvbnMgPSAkZmlyZWJhc2VBcnJheShldmVudFJlZik7XG5cblxuXHRcdH1cblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXIubW9kdWxlKCdzbS5ldmVudCcsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0Jztcblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3NtLmV2ZW50Jylcblx0XHQucnVuKGFwcFJ1bilcblxuXHRcdGZ1bmN0aW9uIGFwcFJ1bihyb3V0ZXJIZWxwZXIpe1xuXHRcdFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldFN0YXRlcygpe1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0YXRlOiAnZXZlbnQnLFxuXHRcdFx0XHRcdGNvbmZpZzoge1xuXHRcdFx0XHRcdFx0dXJsOiAnL2V2ZW50Jyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdldmVudENvbnRyb2xsZXInLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9ldmVudC9ldmVudC5odG1sJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XTtcblx0XHR9O1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uZXZlbnQnKVxuXHRcdC5jb250cm9sbGVyKCdldmVudENvbnRyb2xsZXInLCBldmVudENvbnRyb2xsZXIpO1xuXG5cdFx0ZXZlbnRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckZmlyZWJhc2VBcnJheScsICdGSVJFQkFTRV9VUkknXTtcblxuXHRcdGZ1bmN0aW9uIGV2ZW50Q29udHJvbGxlciAoJHNjb3BlLCAkZmlyZWJhc2VBcnJheSwgRklSRUJBU0VfVVJJKSB7XG5cdFx0XHR2YXIgZXZlbnRSZWYgPSBuZXcgRmlyZWJhc2UoRklSRUJBU0VfVVJJICsgJ1Nlc3Npb24nKTtcblx0XHRcdCRzY29wZS5ldmVudCA9ICRmaXJlYmFzZUFycmF5KGV2ZW50UmVmKTtcblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5ldmVudCwgXCJldmVudCBmb3IgcGFydGljaXBhbnRzXCIpO1xuXHRcdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnc20uY29yZScsIFtdKVxuICAgIFx0LmNvbnN0YW50KCdGSVJFQkFTRV9VUkknLCAnaHR0cHM6Ly9sdW1pbm91cy1pbmZlcm5vLTY0MC5maXJlYmFzZWlvLmNvbS8nKTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdzbS5jb3JlJylcbiAgICAgICAgLmZhY3RvcnkoJ2RhdGFzZXJ2aWNlJywgZGF0YXNlcnZpY2UpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gZGF0YXNlcnZpY2UoKSB7XG4gICAgLy8gICAgIHZhciBpc1ByaW1lZCA9IGZhbHNlO1xuICAgIC8vICAgICB2YXIgcHJpbWVQcm9taXNlO1xuXG4gICAgLy8gICAgIHZhciBzZXJ2aWNlID0ge1xuICAgIC8vICAgICAgICAgZ2V0QXZlbmdlcnNDYXN0OiBnZXRBdmVuZ2Vyc0Nhc3QsXG4gICAgLy8gICAgICAgICBnZXRBdmVuZ2VyQ291bnQ6IGdldEF2ZW5nZXJDb3VudCxcbiAgICAvLyAgICAgICAgIGdldEF2ZW5nZXJzOiBnZXRBdmVuZ2VycyxcbiAgICAvLyAgICAgICAgIHJlYWR5OiByZWFkeVxuICAgIC8vICAgICB9O1xuXG4gICAgLy8gICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgLy8gICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzKCkge1xuICAgIC8vICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9tYWEnKVxuICAgIC8vICAgICAgICAgICAgIC50aGVuKGdldEF2ZW5nZXJzQ29tcGxldGUpXG4gICAgLy8gICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgZXhjZXB0aW9uLmNhdGNoZXIoJ1hIUiBGYWlsZWQgZm9yIGdldEF2ZW5nZXJzJykobWVzc2FnZSk7XG4gICAgLy8gICAgICAgICAgICAgICAgICRsb2NhdGlvbi51cmwoJy8nKTtcbiAgICAvLyAgICAgICAgICAgICB9KTtcblxuICAgIC8vICAgICAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlcnNDb21wbGV0ZShkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiBkYXRhLmRhdGFbMF0uZGF0YS5yZXN1bHRzO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlckNvdW50KCkge1xuICAgIC8vICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAvLyAgICAgICAgIHJldHVybiBnZXRBdmVuZ2Vyc0Nhc3QoKVxuICAgIC8vICAgICAgICAgICAgIC50aGVuKGdldEF2ZW5nZXJzQ2FzdENvbXBsZXRlKVxuICAgIC8vICAgICAgICAgICAgIC5jYXRjaChleGNlcHRpb24uY2F0Y2hlcignWEhSIEZhaWxlZCBmb3IgZ2V0QXZlbmdlckNvdW50JykpO1xuXG4gICAgLy8gICAgICAgICBmdW5jdGlvbiBnZXRBdmVuZ2Vyc0Nhc3RDb21wbGV0ZSAoZGF0YSkge1xuICAgIC8vICAgICAgICAgICAgIGNvdW50ID0gZGF0YS5sZW5ndGg7XG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oY291bnQpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlcnNDYXN0KCkge1xuICAgIC8vICAgICAgICAgdmFyIGNhc3QgPSBbXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdSb2JlcnQgRG93bmV5IEpyLicsIGNoYXJhY3RlcjogJ1RvbnkgU3RhcmsgLyBJcm9uIE1hbid9LFxuICAgIC8vICAgICAgICAgICAgIHtuYW1lOiAnQ2hyaXMgSGVtc3dvcnRoJywgY2hhcmFjdGVyOiAnVGhvcid9LFxuICAgIC8vICAgICAgICAgICAgIHtuYW1lOiAnQ2hyaXMgRXZhbnMnLCBjaGFyYWN0ZXI6ICdTdGV2ZSBSb2dlcnMgLyBDYXB0YWluIEFtZXJpY2EnfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ01hcmsgUnVmZmFsbycsIGNoYXJhY3RlcjogJ0JydWNlIEJhbm5lciAvIFRoZSBIdWxrJ30sXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdTY2FybGV0dCBKb2hhbnNzb24nLCBjaGFyYWN0ZXI6ICdOYXRhc2hhIFJvbWFub2ZmIC8gQmxhY2sgV2lkb3cnfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ0plcmVteSBSZW5uZXInLCBjaGFyYWN0ZXI6ICdDbGludCBCYXJ0b24gLyBIYXdrZXllJ30sXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdHd3luZXRoIFBhbHRyb3cnLCBjaGFyYWN0ZXI6ICdQZXBwZXIgUG90dHMnfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ1NhbXVlbCBMLiBKYWNrc29uJywgY2hhcmFjdGVyOiAnTmljayBGdXJ5J30sXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdQYXVsIEJldHRhbnknLCBjaGFyYWN0ZXI6ICdKYXJ2aXMnfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ1RvbSBIaWRkbGVzdG9uJywgY2hhcmFjdGVyOiAnTG9raSd9LFxuICAgIC8vICAgICAgICAgICAgIHtuYW1lOiAnQ2xhcmsgR3JlZ2cnLCBjaGFyYWN0ZXI6ICdBZ2VudCBQaGlsIENvdWxzb24nfVxuICAgIC8vICAgICAgICAgXTtcbiAgICAvLyAgICAgICAgIHJldHVybiAkcS53aGVuKGNhc3QpO1xuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgZnVuY3Rpb24gcHJpbWUoKSB7XG4gICAgLy8gICAgICAgICAvLyBUaGlzIGZ1bmN0aW9uIGNhbiBvbmx5IGJlIGNhbGxlZCBvbmNlLlxuICAgIC8vICAgICAgICAgaWYgKHByaW1lUHJvbWlzZSkge1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiBwcmltZVByb21pc2U7XG4gICAgLy8gICAgICAgICB9XG5cbiAgICAvLyAgICAgICAgIHByaW1lUHJvbWlzZSA9ICRxLndoZW4odHJ1ZSkudGhlbihzdWNjZXNzKTtcbiAgICAvLyAgICAgICAgIHJldHVybiBwcmltZVByb21pc2U7XG5cbiAgICAvLyAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG4gICAgLy8gICAgICAgICAgICAgaXNQcmltZWQgPSB0cnVlO1xuICAgIC8vICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcmltZWQgZGF0YScpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgZnVuY3Rpb24gcmVhZHkobmV4dFByb21pc2VzKSB7XG4gICAgLy8gICAgICAgICB2YXIgcmVhZHlQcm9taXNlID0gcHJpbWVQcm9taXNlIHx8IHByaW1lKCk7XG5cbiAgICAvLyAgICAgICAgIHJldHVybiByZWFkeVByb21pc2VcbiAgICAvLyAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHsgcmV0dXJuICRxLmFsbChuZXh0UHJvbWlzZXMpOyB9KVxuICAgIC8vICAgICAgICAgICAgIC5jYXRjaChleGNlcHRpb24uY2F0Y2hlcignXCJyZWFkeVwiIGZ1bmN0aW9uIGZhaWxlZCcpKTtcbiAgICAvLyAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdzbS5jb3JlJylcbiAgICAgICAgLnJ1bihhcHBSdW4pO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gYXBwUnVuKHJvdXRlckhlbHBlcikge1xuICAgICAgICB2YXIgb3RoZXJ3aXNlID0gJy80MDQnO1xuICAgICAgICByb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKGdldFN0YXRlcygpLCBvdGhlcndpc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0YXRlcygpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogJzQwNCcsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy80MDQnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NsaWVudC9jb21wb25lbnRzL2NvcmUvNDA0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJzQwNCdcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc20uY2hhdCcsIFtdKTtcbn0pKCk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGFsZXhhbmRlcmtvem92c2tpIG9uIDkvMjQvMTUuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NtLmNoYXQnKVxuICAgIC5kaXJlY3RpdmUoJ2NoYXRNb2R1bGUnLCBjaGF0TW9kdWxlKTtcblxuZnVuY3Rpb24gY2hhdE1vZHVsZSgpe1xuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDonRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOicvY2xpZW50L2NvbXBvbmVudHMvY2hhdC9jaGF0Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnY2hhdEN0cmwnXG4gICAgfTtcblxuXG59IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdzbS5jaGF0JylcbiAgICAuY29udHJvbGxlcignY2hhdEN0cmwnLCBjaGF0Q3RybCk7XG5cbiAgICBjaGF0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGZpcmViYXNlT2JqZWN0JywnJGZpcmViYXNlQXJyYXknLCAnRklSRUJBU0VfVVJJJ11cblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIGNoYXRDdHJsKCRzY29wZSwgJGZpcmViYXNlT2JqZWN0LCRmaXJlYmFzZUFycmF5LCBGSVJFQkFTRV9VUkkpIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgZmlyZWJhc2UgcmVmZXJlbmNlXG4gICAgICAgIHZhciBjaGF0UmVmID0gbmV3IEZpcmViYXNlIChGSVJFQkFTRV9VUkkgKyAnU2Vzc2lvbicgKyAnLycgKyAkc2NvcGUuc2Vzc2lvbklEICsgJy8nICsgJ01lc3NhZ2VzJyk7XG4gICAgICAgIHZhciB1c2VyUmVmID0gbmV3IEZpcmViYXNlIChGSVJFQkFTRV9VUkkgKyAnU2Vzc2lvbicgKyAnLycgKyAkc2NvcGUuc2Vzc2lvbklEICsgJy8nICsgJ1VzZXJzJyk7XG5cbiAgICAgICAgJHNjb3BlLnVzZXIgPSAwO1xuICAgICAgICAkc2NvcGUudm90ZUFyciA9IFtdO1xuXG4gICAgICAgIC8vY3JlYXRlIGFub24gdXNlciB3aXRoIHVpZCBhbmQgbGltaXQgc2Vzc2lvbiB0byBicm93c2VyIG9wZW4gb25seS5cbiAgICAgICAgJHNjb3BlLmF1dGhBbm9uVXNlcj0gZnVuY3Rpb24odXNlcm5hbWUpe1xuICAgICAgICAgICAgY2hhdFJlZi5hdXRoQW5vbnltb3VzbHkoZnVuY3Rpb24oZXJyb3IsIGF1dGhEYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdXRoZW50aWNhdGlvbiBGYWlsZWQhXCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgdXNlclJlZi5wdXNoKHtpZDphdXRoRGF0YS51aWQsIG5hbWU6dXNlcm5hbWUsIHRva2VuOmF1dGhEYXRhLnRva2VufSk7XG4gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2dnZWQgaW4gYXM6XCIsIGF1dGhEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBhdXRoRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51c2VybmFtZSA9IHVzZXJuYW1lO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlbWVtYmVyOiBcInNlc3Npb25cIlxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgICRzY29wZS5tZXNzYWdlcyA9ICRmaXJlYmFzZUFycmF5KGNoYXRSZWYpO1xuXG4gICAgJHNjb3BlLmFkZE1lc3NhZ2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubWVzc2FnZXMuJGFkZCh7XG4gICAgICAgICAgICB0ZXh0OiRzY29wZS5uZXdNZXNzYWdlVGV4dCxcbiAgICAgICAgICAgIGlkOiAkc2NvcGUudXNlci51aWQsXG4gICAgICAgICAgICBuYW1lOiAkc2NvcGUudXNlcm5hbWUsXG4gICAgICAgICAgICB2b3Rlczoge30sXG4gICAgICAgICAgICB0aW1lOkZpcmViYXNlLlNlcnZlclZhbHVlLlRJTUVTVEFNUFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy9mb3JtYXQgVGltZSBmcm9tIFVOSVggdG8gaHVtYW4gcmVhZGFibGVcbiAgICAkc2NvcGUuZm9ybWF0VGltZSA9IGZ1bmN0aW9uKHRpbWVzdGFtcCkge1xuICAgICAgICB2YXIgZGF0ZSA9ICh0aW1lc3RhbXApID8gbmV3IERhdGUodGltZXN0YW1wKSA6IG5ldyBEYXRlKCksXG4gICAgICAgIGhvdXJzID0gZGF0ZS5nZXRIb3VycygpIHx8IDEyLFxuICAgICAgICBtaW51dGVzID0gJycgKyBkYXRlLmdldE1pbnV0ZXMoKSxcbiAgICAgICAgYW1wbSA9IChkYXRlLmdldEhvdXJzKCkgPj0gMTIpID8gJ3BtJyA6ICdhbSc7XG5cbiAgICAgICAgaG91cnMgPSAoaG91cnMgPiAxMikgPyBob3VycyAtIDEyIDogaG91cnM7XG4gICAgICAgIG1pbnV0ZXMgPSAobWludXRlcy5sZW5ndGggPCAyKSA/ICcwJyArIG1pbnV0ZXMgOiBtaW51dGVzO1xuICAgICAgICByZXR1cm4gJycgKyBob3VycyArICc6JyArIG1pbnV0ZXMgKyBhbXBtO1xuICAgIH07XG5cbiAgICAvL2xpc3RlbiBmb3IgY2hhbmdlcyB0byBtb2RlbCBhbmQgcHVsbCB1c2VyIG5hbWVcbiAgICBjaGF0UmVmLm9uKFwiY2hpbGRfYWRkZWRcIiwgZnVuY3Rpb24oc25hcHNob3QsIHByZXZDaGlsZEtleSkge1xuICAgICAgICB2YXIgbmV3TWVzc2FnZSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAkc2NvcGUubmFtZSA9IG5ld01lc3NhZ2UubmFtZTtcbiAgICB9KTtcblxuICAgIC8vIEN1c3RvbSBGaWx0ZXJcblxuICAgIC8vVXB2b3RlIGZ1bmN0aW9uXG4gICAgJHNjb3BlLmVycm9yPSBmYWxzZTtcbiAgICAkc2NvcGUudm90ZWQgPSBmYWxzZTtcblxuICAgICRzY29wZS51cFZvdGUgPSBmdW5jdGlvbihpbmRleCwgbWVzc2FnZSl7XG4gICAgICAgIGlmKCEkc2NvcGUudXNlcil7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPXRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUudXNlci51aWQsIFwiVUlEXCIpO1xuICAgICAgICAgICAgaWYgKCFtZXNzYWdlLnZvdGVzKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZS52b3RlcyA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobWVzc2FnZS52b3Rlc1skc2NvcGUudXNlci5hdXRoLnVpZF0pO1xuICAgICAgICAgICAgbWVzc2FnZS52b3Rlc1skc2NvcGUudXNlci5hdXRoLnVpZF0gPSAhKCRzY29wZS51c2VyLmF1dGgudWlkIGluIG1lc3NhZ2Uudm90ZXMpID8gMCA6IG1lc3NhZ2Uudm90ZXNbJHNjb3BlLnVzZXIuYXV0aC51aWRdICsgMTtcbiAgICAgICAgICAgIG1lc3NhZ2Uudm90ZWNvdW50ID0gT2JqZWN0LmtleXMobWVzc2FnZS52b3RlcykubGVuZ3RoO1xuICAgICAgICAgICAgJHNjb3BlLnZvdGVBcnIucHVzaChtZXNzYWdlLnZvdGVjb3VudCk7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZXMuJHNhdmUoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzbScsIFtcblxuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ2ZpcmViYXNlJyxcblxuICAgICAgICAvKlxuICAgICAgICAgKiBPcmRlciBpcyBub3QgaW1wb3J0YW50LlxuICAgICAgICAgKiBFdmVyeWJvZHkgaGFzIGFjY2VzcyB0byB0aGVzZS5cbiAgICAgICAgICogV2UgY291bGQgcGxhY2UgdGhlc2UgdW5kZXIgZXZlcnkgZmVhdHVyZSBhcmVhLFxuICAgICAgICAgKiBidXQgdGhpcyBpcyBlYXNpZXIgdG8gbWFpbnRhaW4uXG4gICAgICAgICAqLyBcbiAgICAgICAgIFxuICAgICAgICAnc20uY29yZScsXG4gICAgICAgICdzbS5yb3V0ZXInLFxuICAgICAgICAnbmdGaWxlVXBsb2FkJyxcblxuICAgICAgICAvKlxuICAgICAgICAgKiBGZWF0dXJlIGFyZWFzXG4gICAgICAgICAqL1xuICAgICAgICAgXG4gICAgICAgICdzbS5hZG1pbicsXG4gICAgICAgICdzbS5hZG1pbkNyZWF0ZScsXG4gICAgICAgICdzbS5jYycsXG4gICAgICAgICdzbS5jaGF0JyxcbiAgICAgICAgJ3NtLnNlc3Npb24nLFxuICAgICAgICAnc20uc2lnbmluJyxcbiAgICAgICAgJ3NtLnNpZ251cCcsXG4gICAgICAgICdzbS5ldmVudCcsXG4gICAgICAgICdzbS5wYXJ0aWNpcGFudCcsXG4gICAgICAgICdzbS5zaWduaW4nXG4gICAgXSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzbS5maXJlYmFzZScsW10pXG4gICAgXHQuY29uc3RhbnQoJ0ZJUkVCQVNFX1VSSScsICdodHRwczovL2x1bWlub3VzLWluZmVybm8tNjQwLmZpcmViYXNlaW8uY29tJyk7XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9