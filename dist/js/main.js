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
				url: '/',
				templateUrl: 'client/components/participant/participant.html'
			}
		}
		]
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
    	.constant('FIREBASE_URI', 'https://luminous-inferno-640.firebaseio.com/')
        .run(function ($rootScope, $state) {
            $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
                console.log("hey");
                if (toState.authenticate && !$rootScope.authData){
                    console.log("user is not authenticated");
                    $rootScope.notauth = "Please sign in to access this section";
                    $state.transitionTo("signin");
                    event.preventDefault();
                }
            });
        });

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
						templateUrl: 'client/components/admin/admin.html',
						authenticate: true
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
    ])

})();
(function() {
    'use strict';

    angular.module('sm.firebase',[])
    	.constant('FIREBASE_URI', 'https://luminous-inferno-640.firebaseio.com');

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvcm91dGVyL3JvdXRlci5tb2R1bGUuanMiLCJjb3JlL3JvdXRlci9yb3V0ZXIucHJvdmlkZXIuanMiLCJzZXNzaW9uL3Nlc3Npb24ubW9kdWxlLmpzIiwic2Vzc2lvbi92aWV3L3Nlc3Npb24udmlldy5yb3V0ZXMuanMiLCJzZXNzaW9uL3ZpZXcvc2Vzc2lvbi52aWV3LmNvbnRyb2xsZXIuanMiLCJzZXNzaW9uL3RpbGUvc2Vzc2lvbi50aWxlLmRpcmVjdGl2ZS5qcyIsInBhcnRpY2lwYW50L3BhcnRpY2lwYW50Lm1vZHVsZS5qcyIsInBhcnRpY2lwYW50L21lc2hwb2ludHMvbWVzaHB0cy5kaXJlY3RpdmUuanMiLCJjb21tb24vY2MubW9kdWxlLmpzIiwiY29tbW9uL25hdmJhci9uYXZiYXIuZGlyZWN0aXZlLmpzIiwiYWRtaW4vY3JlYXRlL2FkbWluLmNyZWF0ZS5tb2R1bGUuanMiLCJhZG1pbi9jcmVhdGUvYWRtaW4uY3JlYXRlLnJvdXRlcy5qcyIsImFkbWluL2NyZWF0ZS9hZG1pbi5jcmVhdGUuZmFjdG9yeS5qcyIsImFkbWluL2NyZWF0ZS9hZG1pbi5jcmVhdGUuY29udHJvbGxlci5qcyIsInNpZ251cC9zaWdudXAubW9kdWxlLmpzIiwic2lnbnVwL3NpZ251cC5yb3V0ZXMuanMiLCJzaWdudXAvc2lnbnVwLmNvbnRyb2xsZXIuanMiLCJzaWduaW4vc2lnbmluLm1vZHVsZS5qcyIsInNpZ25pbi9zaWduaW4ucm91dGVzLmpzIiwic2lnbmluL3NpZ25pbi5jb250cm9sbGVyLmpzIiwicGFydGljaXBhbnQvcGFydGljaXBhbnQucm91dGVzLmpzIiwiZXZlbnQvZXZlbnQubW9kdWxlLmpzIiwiZXZlbnQvZXZlbnQucm91dGVzLmpzIiwiZXZlbnQvZXZlbnQuY29udHJvbGxlci5qcyIsImNvcmUvY29yZS5tb2R1bGUuanMiLCJjb3JlL2RhdGFzZXJ2aWNlLmpzIiwiY29yZS9jb3JlLnJvdXRlLmpzIiwiY2hhdC9jaGF0Lm1vZHVsZS5qcyIsImNoYXQvY2hhdC5kaXIuanMiLCJjaGF0L2NoYXQuY3RybC5qcyIsImFkbWluL2FkbWluLm1vZHVsZS5qcyIsImFkbWluL2FkbWluLnJvdXRlcy5qcyIsImFkbWluL2FkbWluLmNvbnRyb2xsZXIuanMiLCJzbS5tb2R1bGUuanMiLCJzbS5maXJlYmFzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0YW5ndWxhci5tb2R1bGUoJ3NtLnJvdXRlcicsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3NtLnJvdXRlcicpXG4gICAgICAgIC5wcm92aWRlcigncm91dGVySGVscGVyJywgcm91dGVySGVscGVyUHJvdmlkZXIpO1xuXG4gICAgICAgIHJvdXRlckhlbHBlclByb3ZpZGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvblByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlciddO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJvdXRlckhlbHBlclByb3ZpZGVyKCRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgICAgIHRoaXMuJGdldCA9IFJvdXRlckhlbHBlcjtcblxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuXG4gICAgICAgICAgICBSb3V0ZXJIZWxwZXIuJGluamVjdCA9IFsnJHN0YXRlJ107XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIFJvdXRlckhlbHBlcigkc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFzT3RoZXJ3aXNlID0gZmFsc2U7XG5cblxuXG4gICAgICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyZVN0YXRlczogY29uZmlndXJlU3RhdGVzLFxuICAgICAgICAgICAgICAgICAgICBnZXRTdGF0ZXM6IGdldFN0YXRlc1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY29uZmlndXJlU3RhdGVzKHN0YXRlcywgb3RoZXJ3aXNlUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZXMuZm9yRWFjaChmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoc3RhdGUuc3RhdGUsIHN0YXRlLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJ3aXNlUGF0aCAmJiAhaGFzT3RoZXJ3aXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNPdGhlcndpc2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShvdGhlcndpc2VQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlcygpIHsgcmV0dXJuICRzdGF0ZS5nZXQoKTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3NtLnNlc3Npb24nLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdzbS5zZXNzaW9uJylcblx0XHQucnVuKGFwcFJ1bilcblxuXHRcdGZ1bmN0aW9uIGFwcFJ1bihyb3V0ZXJIZWxwZXIpe1xuXHRcdFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSk7XG5cdFx0fVxuXG5cdFx0Ly8gZ2V0U3RhdGVzLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyRzdGF0ZVBhcmFtcyddO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0U3RhdGVzKCl7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RhdGU6ICdzZXNzaW9uJyxcblx0XHRcdFx0XHRjb25maWc6IHtcblx0XHRcdFx0XHRcdHVybDogJy9zZXNzaW9uLzppZCcsXG5cdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnU2Vzc2lvbkNvbnRyb2xsZXInLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9zZXNzaW9uL3ZpZXcvc2Vzc2lvbi52aWV3Lmh0bWwnLFxuXHRcdFx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdFx0XHRzZXNzaW9uSUQ6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcykge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAkc3RhdGVQYXJhbXMuaWQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdF07XG5cdFx0fTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3NtLnNlc3Npb24nKVxuXHRcdC5jb250cm9sbGVyKCdTZXNzaW9uQ29udHJvbGxlcicsIFNlc3Npb25Db250cm9sbGVyKTtcblxuXHRcdFNlc3Npb25Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdzZXNzaW9uSUQnLCAnJGZpcmViYXNlT2JqZWN0JywgJ0ZJUkVCQVNFX1VSSSddO1xuXG5cdFx0ZnVuY3Rpb24gU2Vzc2lvbkNvbnRyb2xsZXIoJHNjb3BlLCBzZXNzaW9uSUQsICRmaXJlYmFzZU9iamVjdCwgRklSRUJBU0VfVVJJKSB7XG5cdFx0XHQkc2NvcGUuc2Vzc2lvbklEID0gc2Vzc2lvbklEO1xuXHRcdFx0dmFyIHNlc3Npb25SZWYgPSBuZXcgRmlyZWJhc2UoRklSRUJBU0VfVVJJICsgJ1Nlc3Npb24nICsgJy8nICsgc2Vzc2lvbklEKTtcblx0XHRcdCRzY29wZS5zZXNzaW9uID0gJGZpcmViYXNlT2JqZWN0KHNlc3Npb25SZWYpO1xuXHRcdFx0JHNjb3BlLnZvdGUgPSAwO1xuXHRcdFx0JHNjb3BlLnNlc3Npb25Wb3RlID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLnZvdGUgKytcblx0XHRcdH1cblxuXHRcdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uc2Vzc2lvbicpXG5cdFx0LmRpcmVjdGl2ZSgnc2Vzc2lvblRpbGUnLCBzZXNzaW9uVGlsZSk7XG5cblx0XHRmdW5jdGlvbiBzZXNzaW9uVGlsZSgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdFx0J3Nlc3Npb24nOiAnPSdcblx0XHRcdFx0fSxcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9zZXNzaW9uL3RpbGUvc2Vzc2lvbi50aWxlLmh0bWwnXG5cdFx0XHR9XG5cdFx0fVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc20ucGFydGljaXBhbnQnLCBbXSk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NtLnBhcnRpY2lwYW50JylcbiAgICAuZGlyZWN0aXZlKCdwYXJ0aWNpcGFudEltZycsIHBhcnRpY2lwYW50SW1nKTtcblxuZnVuY3Rpb24gcGFydGljaXBhbnRJbWcoKXtcblx0XHR2YXIgZGlyZWN0aXZlID0ge1xuXHRcdFx0bGluazogbGluayxcbiAgICAgIHRlbXBsYXRlVXJsOicvY2xpZW50L2NvbXBvbmVudHMvcGFydGljaXBhbnQvbWVzaHBvaW50cy9tZXNocHRzLmh0bWwnLFxuICAgIFx0cmVzdHJpY3Q6ICdFJ1xuICAgIH07XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgXHRhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsaW5rcyA9IFtdO1xuICAgICAgICAgICAgdmFyIGxpbmtzX2NvdW50ID0gMzI7XG4gICAgICAgICAgICB2YXIgY29ubmVjdHNfdGltZSA9IDI0MDtcbiAgICAgICAgICAgIHZhciBjb25uZWN0c19jb3VudCA9IDI7XG4gICAgICAgICAgICB2YXIgdGhlbWVfc3RhcnQgPSB7IFg6MTUwLCBZOjE1MCwgVzozMDAsIEg6MzAwIH07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpbWl0X251bWJlcihtaW4sIGN1ciwgbWF4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1ciA8IG1pbikgcmV0dXJuIG1pbjtcbiAgICAgICAgICAgICAgICBpZiAoY3VyID4gbWF4KSByZXR1cm4gbWF4O1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHByaW50X3JnYmEociwgZywgYiwgYSkgeyByZXR1cm4gXCJyZ2JhKFwiK3IrXCIsXCIrZytcIixcIitiK1wiLFwiK2ErXCIpXCI7IH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gTGlua2VyKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgY29ubmVjdHMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7aTxjb25uZWN0c19jb3VudDtpKyspIGNvbm5lY3RzLnB1c2goQ29ubmVjdG9yKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFydF94ID0gTWF0aC5yYW5kb20oKSAqIHRoZW1lX3N0YXJ0Llc7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0X3kgPSBNYXRoLnJhbmRvbSgpICogdGhlbWVfc3RhcnQuSDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIFg6IHN0YXJ0X3gsXG4gICAgICAgICAgICAgICAgICAgIFk6IHN0YXJ0X3ksXG4gICAgICAgICAgICAgICAgICAgIFRYOiBzdGFydF94LFxuICAgICAgICAgICAgICAgICAgICBUWTogc3RhcnRfeSxcbiAgICAgICAgICAgICAgICAgICAgTmV3Sm9iOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0eCA9IHRoaXMuWCArIE1hdGgucmFuZG9tKCkgKiAyMDAgLSAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHkgPSB0aGlzLlkgKyBNYXRoLnJhbmRvbSgpICogMjAwIC0gMTAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlRYID0gbGltaXRfbnVtYmVyKE1hdGgucmFuZG9tKCkgKiA1MCwgdHgsIHRoZW1lX3N0YXJ0LlcgLSBNYXRoLnJhbmRvbSgpICogNTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5UWSA9IGxpbWl0X251bWJlcihNYXRoLnJhbmRvbSgpICogNTAsIHR5LCB0aGVtZV9zdGFydC5IIC0gTWF0aC5yYW5kb20oKSAqIDUwKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgTW92aW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh0aGlzLlRYIC0gdGhpcy5YLCAyKSArIE1hdGgucG93KHRoaXMuVFkgLSB0aGlzLlksIDIpKSA+IDE7IH0sXG4gICAgICAgICAgICAgICAgICAgIENvbm5lY3RvcnM6IGNvbm5lY3RzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gQ29ubmVjdG9yKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBcbiAgICAgICAgICAgICAgICAgICAgVGltZTotMSxcbiAgICAgICAgICAgICAgICAgICAgVGFyZ2V0Om51bGwsXG4gICAgICAgICAgICAgICAgICAgIE5ld0pvYjpmdW5jdGlvbigpeyB0aGlzLlRhcmdldCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxpbmtzX2NvdW50KTsgdGhpcy5UaW1lID0gTWF0aC5yYW5kb20oKSAqIGNvbm5lY3RzX3RpbWU7IH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlua3NfY291bnQ7IGkrKykgbGlua3MucHVzaChMaW5rZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRyYXcoKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlua3NfY291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWxpbmtzW2ldLk1vdmluZygpKSBsaW5rc1tpXS5OZXdKb2IoKTtcbiAgICAgICAgICAgICAgICAgICAgbGlua3NbaV0uWCArPSAobGlua3NbaV0uVFggLSBsaW5rc1tpXS5YKSAvIDI0O1xuICAgICAgICAgICAgICAgICAgICBsaW5rc1tpXS5ZICs9IChsaW5rc1tpXS5UWSAtIGxpbmtzW2ldLlkpIC8gMjQ7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBqPTA7ajxsaW5rc1tpXS5Db25uZWN0b3JzLmxlbmd0aDtqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rc1tpXS5Db25uZWN0b3JzW2pdLlRpbWUgPCAwKSBsaW5rc1tpXS5Db25uZWN0b3JzW2pdLk5ld0pvYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlua3NbaV0uQ29ubmVjdG9yc1tqXS5UaW1lIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZyYW1lJyk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnZhcy5nZXRDb250ZXh0KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IDMwMDtcblxuICAgICAgICAgICAgICAgICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW92ZXInO1xuICAgICAgICAgICAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoZW1lX3N0YXJ0LlcsIHRoZW1lX3N0YXJ0LkgpO1xuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcIiNDMEJGQkVcIjtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiI0MwQkZCRVwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxsaW5rc19jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGo9MDtqPGxpbmtzW2ldLkNvbm5lY3RvcnMubGVuZ3RoO2orKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb25uZWN0ID0gbGlua3NbbGlua3NbaV0uQ29ubmVjdG9yc1tqXS5UYXJnZXRdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmVzUGF0aCA9IG5ldyBQYXRoMkQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1BhdGgubW92ZVRvKGxpbmtzW2ldLlgsIGxpbmtzW2ldLlkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzUGF0aC5saW5lVG8oY29ubmVjdC5YLCBjb25uZWN0LlkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHByaW50X3JnYmEoOTgsIDk4LCA5OCwgbGltaXRfbnVtYmVyKC4zLCBsaW5rc1tpXS5Db25uZWN0b3JzW2pdLlRpbWUgLyAxMDAsIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKGxpbmVzUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJjUGF0aCA9IG5ldyBQYXRoMkQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGxpbmtzX2NvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY1BhdGgubW92ZVRvKGxpbmtzW2ldLlgsIGxpbmtzW2ldLlkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJjUGF0aC5hcmMobGlua3NbaV0uWCwgbGlua3NbaV0uWSwgNCwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsKGFyY1BhdGgpO1xuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKGFyY1BhdGgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluaXQoKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cblxufSIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnc20uY2MnLFtdKTtcblx0XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3NtLmNjJylcblx0XHQuZGlyZWN0aXZlKCduYXZCYXInLCBuYXZCYXIpO1xuXG5cdGZ1bmN0aW9uIG5hdkJhcigpIHtcblxuXHRcdHZhciBkaXJlY3RpdmUgPSB7XG5cdFx0XHR0ZW1wbGF0ZVVybDogJ2NsaWVudC9jb21wb25lbnRzL2NvbW1vbi9uYXZiYXIvbmF2YmFyLmh0bWwnLFxuXHRcdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdH1cblxuXHRcdHJldHVybiBkaXJlY3RpdmU7XG5cdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnO1xuXHRhbmd1bGFyLm1vZHVsZSgnc20uYWRtaW5DcmVhdGUnLFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3NtLmFkbWluQ3JlYXRlJylcblx0XHQucnVuKGFwcFJ1bik7XG5cblx0XHRmdW5jdGlvbiBhcHBSdW4ocm91dGVySGVscGVyKXtcblx0XHRcdHJvdXRlckhlbHBlci5jb25maWd1cmVTdGF0ZXMoZ2V0U3RhdGVzKCkpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXRTdGF0ZXMoKXtcblx0XHRcdHJldHVybiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzdGF0ZTogJ2FkbWluY3JlYXRlJyxcblx0XHRcdFx0XHRjb25maWc6IHtcblx0XHRcdFx0XHRcdHVybDogJy8nLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0FkbWluQ3JlYXRlQ29udHJvbGxlcicsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2NsaWVudC9jb21wb25lbnRzL2FkbWluL2NyZWF0ZS9hZG1pbi5jcmVhdGUuaHRtbCdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHR9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3NtLmFkbWluQ3JlYXRlJylcbiAgICAgICAgLmZhY3RvcnkoJ0FkbWluRmFjdG9yeScsIEFkbWluRmFjdG9yeSk7XG5cbiAgICBBZG1pbkZhY3RvcnkuJGluamVjdCA9IFsnVXBsb2FkJywnRklSRUJBU0VfVVJJJ107XG5cblxuICAgIGZ1bmN0aW9uIEFkbWluRmFjdG9yeShVcGxvYWQpe1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZEltZyhmaWxlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZpbGUsIFwiZmFjdG9yeVwiKVxuICAgICAgICAgICAgcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xuICAgICAgICAgICAgICAgIHVybDpcIi9hcGkvdXBsb2FkL2ltYWdlXCIsXG4gICAgICAgICAgICAgICAgZmlsZTpmaWxlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB1cGxvYWRJbWc6IHVwbG9hZEltZ1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cblx0YW5ndWxhclxuXHQubW9kdWxlKCdzbS5hZG1pbkNyZWF0ZScpXG5cdC5jb250cm9sbGVyKCdBZG1pbkNyZWF0ZUNvbnRyb2xsZXInLCBBZG1pbkNyZWF0ZUNvbnRyb2xsZXIpO1xuXG5cdEFkbWluQ3JlYXRlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRzdGF0ZScsICckcm9vdFNjb3BlJywnQWRtaW5GYWN0b3J5JywgJyRmaXJlYmFzZU9iamVjdCcsJyRmaXJlYmFzZUFycmF5JywnRklSRUJBU0VfVVJJJ107XG5cblx0ZnVuY3Rpb24gQWRtaW5DcmVhdGVDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsICRyb290U2NvcGUsIEFkbWluRmFjdG9yeSwgJGZpcmViYXNlT2JqZWN0LCAkZmlyZWJhc2VBcnJheSwgRklSRUJBU0VfVVJJKXtcblx0XHR2YXIgZXZlbnRSZWYgPSBuZXcgRmlyZWJhc2UoRklSRUJBU0VfVVJJICsgJ1Nlc3Npb24nKTtcblxuXHRcdC8vaW5zdGF0aWF0ZSBzZXNzaW9uIG9iamVjdCBhbmQgYWRkIHRvICRzY29wZVxuXHRcdCRzY29wZS5zZXNzaW9uID0ge1xuXHRcdFx0Ly8gbmFtZTogXCJcIixcblx0XHRcdC8vIGNhdGVnb3J5OiBcIlwiLFxuXHRcdFx0ZGVzYzogXCJcIlxuXHRcdFx0Ly8gYnVkZ2V0OiBcIlwiLFxuXHRcdFx0Ly8gYWRkcmVzczogXCJcIixcblx0XHRcdC8vIGltZ1VybDpcIlwiXG5cdFx0fTtcblxuXG5cdFx0JHNjb3BlLnNlc3Npb25zID0gJGZpcmViYXNlQXJyYXkoZXZlbnRSZWYpO1xuXG5cdFx0JHNjb3BlLnN1Ym1pdFNlc3Npb24gPSBmdW5jdGlvbihzZXNzaW9uKXtcblx0XHRcdCRzY29wZS5zZXNzaW9ucy4kYWRkKHNlc3Npb24pO1xuXHRcdFx0JHNjb3BlLnNlc3Npb24gPXt9O1xuXHRcdFx0JHNjb3BlLnVwbG9hZCA9XCJcIjtcblx0XHRcdCRzdGF0ZS5nbygnaWRlYXMnKTtcblx0XHR9O1xuXG5cdFx0Ly93YXRjaCBmaWxlIGZvciBjaGFuZ2UsIGRvIHN0dWZmIGFuZCB0cmlnZ2VyIGZhY3RvcnkgRnVuYy5cblx0XHQvLyAkc2NvcGUuJHdhdGNoKCdmaWxlJywgZnVuY3Rpb24oZmlsZSl7XG5cdFx0Ly8gXHRpZihmaWxlKXtcblx0XHQvLyBcdFx0JHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG5cdFx0Ly8gXHRcdEFkbWluRmFjdG9yeS51cGxvYWRJbWcoJHNjb3BlLmZpbGUpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0Ly8gXHRcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0XHQvLyBcdFx0XHRjb25zb2xlLmxvZyhkYXRhLCBcImRhdGFcIik7XG5cdFx0Ly8gXHRcdFx0JHNjb3BlLnVwbG9hZCA9IGRhdGE7XG5cblx0XHQvLyAvL2dldCBwYXRoIG9uIGNhbGxiYWNrIGZyb20gQVdTXG5cdFx0Ly8gdmFyIGluaXRpYWxfcGF0aCA9XCJodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3N1cGVybWVzaC9cIjtcblx0XHQvLyAvL3RoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugb2YgdGhlIHdheSBBV1MgZm9ybWF0cyBzcGFjZXMgXCIrXCJcblx0XHQvLyAkc2NvcGUuc2Vzc2lvbi5pbWdVcmwgPSBpbml0aWFsX3BhdGggKyBkYXRhLmRhdGEuc3BsaXQoJyAnKS5qb2luKCcrJyk7XG5cblx0XHQvLyB9KTtcblx0XHQvLyBcdH1cblx0XHQvLyB9KVxuXG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzbS5zaWdudXAnLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXJcblx0Lm1vZHVsZSgnc20uc2lnbnVwJylcblx0LnJ1bihhcHBSdW4pXG5cblx0ZnVuY3Rpb24gYXBwUnVuKHJvdXRlckhlbHBlcil7XG5cdFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSk7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRTdGF0ZXMoKXtcblxuXHRcdHJldHVybiBbXG5cdFx0e1xuXHRcdFx0c3RhdGU6ICdzaWdudXAnLFxuXHRcdFx0Y29uZmlnOiB7XG5cdFx0XHRcdHVybDogJy9zaWdudXAnLFxuXHRcdFx0XHRjb250cm9sbGVyOlwic2lnblVwQ3RybFwiLFxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2NsaWVudC9jb21wb25lbnRzL3NpZ251cC9zaWdudXAuaHRtbCdcblx0XHRcdH1cblx0XHR9XG5cdFx0XVxuXHR9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3NtLnNpZ251cCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdzaWduVXBDdHJsJywgc2lnblVwQ3RybCk7XG5cbiAgICBzaWduVXBDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsJyRzdGF0ZScsICckcm9vdFNjb3BlJywnJGZpcmViYXNlQXV0aCcsICdGSVJFQkFTRV9VUkknXTtcblxuICAgIGZ1bmN0aW9uIHNpZ25VcEN0cmwoJHNjb3BlLCAkc3RhdGUsJHJvb3RTY29wZSwgJGZpcmViYXNlQXV0aCwgRklSRUJBU0VfVVJJKSB7XG5cbiAgICAgICAgdmFyIHJlZiA9IG5ldyBGaXJlYmFzZShGSVJFQkFTRV9VUkkgKydBZG1pbicpO1xuICAgICAgICB2YXIgYXV0aE9iaiA9ICRmaXJlYmFzZUF1dGgocmVmKTtcblxuICAgICAgICAkc2NvcGUuc2lnblVwVXNlciA9IGZ1bmN0aW9uIChlbWFpbCwgcGFzc3dvcmQpIHtcblxuICAgICAgICAgICAgYXV0aE9iai4kY3JlYXRlVXNlcih7XG4gICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbih1c2VyRGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBcIiArIHVzZXJEYXRhLnVpZCArIFwiIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5IVwiKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBhdXRoT2JqLiRhdXRoV2l0aFBhc3N3b3JkKHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oYXV0aERhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvZ2dlZCBpbiBhczpcIiwgYXV0aERhdGEudWlkKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhEYXRhID0gYXV0aERhdGE7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZG1pbicpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID1lcnJvcjtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZW1haWwgPVwiXCI7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBhc3N3b3JkID1cIlwiO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnc2lnbnVwJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NtLnNpZ25pbicsIFtdKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0Jztcblx0YW5ndWxhclxuXHQubW9kdWxlKCdzbS5zaWduaW4nKVxuXHQucnVuKGFwcFJ1bilcblxuXHRmdW5jdGlvbiBhcHBSdW4ocm91dGVySGVscGVyKXtcblx0XHRyb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKGdldFN0YXRlcygpKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldFN0YXRlcygpe1xuXG5cdFx0cmV0dXJuIFtcblx0XHR7XG5cdFx0XHRzdGF0ZTogJ3NpZ25pbicsXG5cdFx0XHRjb25maWc6IHtcblx0XHRcdFx0dXJsOiAnL3NpZ25pbicsXG5cdFx0XHRcdGNvbnRyb2xsZXI6XCJzaWduSW5DdHJsXCIsXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnY2xpZW50L2NvbXBvbmVudHMvc2lnbmluL3NpZ25pbi5odG1sJ1xuXHRcdFx0fVxuXHRcdH1cblx0XHRdXG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnc20uc2lnbmluJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ3NpZ25JbkN0cmwnLCBzaWduSW5DdHJsKTtcblxuICAgIHNpZ25JbkN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywnJHN0YXRlJywgJyRyb290U2NvcGUnLCAnJGZpcmViYXNlQXV0aCcsICdGSVJFQkFTRV9VUkknXTtcblxuICAgIGZ1bmN0aW9uIHNpZ25JbkN0cmwoJHNjb3BlLCAkc3RhdGUsJHJvb3RTY29wZSwgJGZpcmViYXNlQXV0aCwgRklSRUJBU0VfVVJJKSB7XG5cbiAgICAgICAgdmFyIHJlZiA9IG5ldyBGaXJlYmFzZShGSVJFQkFTRV9VUkkgKydBZG1pbicpO1xuICAgICAgICB2YXIgYWRtaW5PYmogPSAkZmlyZWJhc2VBdXRoKHJlZik7XG5cbiAgICAgICAgJHNjb3BlLmF1dGhFbWFpbFVzZXIgPSBmdW5jdGlvbiAoZW1haWwsIHBhc3N3b3JkKSB7XG5cbiAgICAgICAgICAgIGFkbWluT2JqLiRhdXRoV2l0aFBhc3N3b3JkKHtcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChhdXRoRGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9nZ2VkIGluIGFzOlwiLCBhdXRoRGF0YS51aWQpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuYXV0aERhdGEgPSBhdXRoRGF0YTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkbWluJyk7XG5cblxuXG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQXV0aGVudGljYXRpb24gZmFpbGVkOlwiLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID1lcnJvcjtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZW1haWwgPVwiXCI7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBhc3N3b3JkID1cIlwiO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnc2lnbmluJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cblxuXG5cbiAgICAgICAgLy8gbm93LCByZWRpcmVjdCBvbmx5IG5vdCBhdXRoZW50aWNhdGVkXG5cbiAgICAgICAgLy92YXIgdXNlckluZm8gPSBhdXRoZW50aWNhdGlvblN2Yy5nZXRVc2VySW5mbygpO1xuICAgICAgICAvL1xuICAgICAgICAvL2lmKHVzZXJJbmZvLmF1dGhlbnRpY2F0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIC8vICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gc3RvcCBjdXJyZW50IGV4ZWN1dGlvblxuICAgICAgICAvLyAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7IC8vIGdvIHRvIGxvZ2luXG4gICAgICAgIC8vfVxuXG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnO1xuXHRhbmd1bGFyXG5cdC5tb2R1bGUoJ3NtLnBhcnRpY2lwYW50Jylcblx0LnJ1bihhcHBSdW4pXG5cblx0ZnVuY3Rpb24gYXBwUnVuKHJvdXRlckhlbHBlcil7XG5cdFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSk7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRTdGF0ZXMoKXtcblxuXHRcdHJldHVybiBbXG5cdFx0e1xuXHRcdFx0c3RhdGU6ICdwYXJ0aWNpcGFudCcsXG5cdFx0XHRjb25maWc6IHtcblx0XHRcdFx0dXJsOiAnLycsXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnY2xpZW50L2NvbXBvbmVudHMvcGFydGljaXBhbnQvcGFydGljaXBhbnQuaHRtbCdcblx0XHRcdH1cblx0XHR9XG5cdFx0XVxuXHR9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0YW5ndWxhci5tb2R1bGUoJ3NtLmV2ZW50JywgW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnO1xuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uZXZlbnQnKVxuXHRcdC5ydW4oYXBwUnVuKVxuXG5cdFx0ZnVuY3Rpb24gYXBwUnVuKHJvdXRlckhlbHBlcil7XG5cdFx0XHRyb3V0ZXJIZWxwZXIuY29uZmlndXJlU3RhdGVzKGdldFN0YXRlcygpKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0U3RhdGVzKCl7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RhdGU6ICdldmVudCcsXG5cdFx0XHRcdFx0Y29uZmlnOiB7XG5cdFx0XHRcdFx0XHR1cmw6ICcvZXZlbnQnLFxuXHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ2V2ZW50Q29udHJvbGxlcicsXG5cdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2NsaWVudC9jb21wb25lbnRzL2V2ZW50L2V2ZW50Lmh0bWwnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRdO1xuXHRcdH07XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdzbS5ldmVudCcpXG5cdFx0LmNvbnRyb2xsZXIoJ2V2ZW50Q29udHJvbGxlcicsIGV2ZW50Q29udHJvbGxlcik7XG5cblx0XHRldmVudENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRmaXJlYmFzZUFycmF5JywgJ0ZJUkVCQVNFX1VSSSddO1xuXG5cdFx0ZnVuY3Rpb24gZXZlbnRDb250cm9sbGVyICgkc2NvcGUsICRmaXJlYmFzZUFycmF5LCBGSVJFQkFTRV9VUkkpIHtcblx0XHRcdHZhciBldmVudFJlZiA9IG5ldyBGaXJlYmFzZShGSVJFQkFTRV9VUkkgKyAnU2Vzc2lvbicpO1xuXHRcdFx0JHNjb3BlLmV2ZW50ID0gJGZpcmViYXNlQXJyYXkoZXZlbnRSZWYpO1xuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLmV2ZW50LCBcImV2ZW50IGZvciBwYXJ0aWNpcGFudHNcIik7XG5cdFx0fVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdzbS5jb3JlJywgW10pXG4gICAgXHQuY29uc3RhbnQoJ0ZJUkVCQVNFX1VSSScsICdodHRwczovL2x1bWlub3VzLWluZmVybm8tNjQwLmZpcmViYXNlaW8uY29tLycpXG4gICAgICAgIC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oXCIkc3RhdGVDaGFuZ2VTdGFydFwiLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJoZXlcIik7XG4gICAgICAgICAgICAgICAgaWYgKHRvU3RhdGUuYXV0aGVudGljYXRlICYmICEkcm9vdFNjb3BlLmF1dGhEYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1c2VyIGlzIG5vdCBhdXRoZW50aWNhdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLm5vdGF1dGggPSBcIlBsZWFzZSBzaWduIGluIHRvIGFjY2VzcyB0aGlzIHNlY3Rpb25cIjtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhcInNpZ25pblwiKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnc20uY29yZScpXG4gICAgICAgIC5mYWN0b3J5KCdkYXRhc2VydmljZScsIGRhdGFzZXJ2aWNlKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIGRhdGFzZXJ2aWNlKCkge1xuICAgIC8vICAgICB2YXIgaXNQcmltZWQgPSBmYWxzZTtcbiAgICAvLyAgICAgdmFyIHByaW1lUHJvbWlzZTtcblxuICAgIC8vICAgICB2YXIgc2VydmljZSA9IHtcbiAgICAvLyAgICAgICAgIGdldEF2ZW5nZXJzQ2FzdDogZ2V0QXZlbmdlcnNDYXN0LFxuICAgIC8vICAgICAgICAgZ2V0QXZlbmdlckNvdW50OiBnZXRBdmVuZ2VyQ291bnQsXG4gICAgLy8gICAgICAgICBnZXRBdmVuZ2VyczogZ2V0QXZlbmdlcnMsXG4gICAgLy8gICAgICAgICByZWFkeTogcmVhZHlcbiAgICAvLyAgICAgfTtcblxuICAgIC8vICAgICByZXR1cm4gc2VydmljZTtcblxuICAgIC8vICAgICBmdW5jdGlvbiBnZXRBdmVuZ2VycygpIHtcbiAgICAvLyAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbWFhJylcbiAgICAvLyAgICAgICAgICAgICAudGhlbihnZXRBdmVuZ2Vyc0NvbXBsZXRlKVxuICAgIC8vICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgIGV4Y2VwdGlvbi5jYXRjaGVyKCdYSFIgRmFpbGVkIGZvciBnZXRBdmVuZ2VycycpKG1lc3NhZ2UpO1xuICAgIC8vICAgICAgICAgICAgICAgICAkbG9jYXRpb24udXJsKCcvJyk7XG4gICAgLy8gICAgICAgICAgICAgfSk7XG5cbiAgICAvLyAgICAgICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzQ29tcGxldGUoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gZGF0YS5kYXRhWzBdLmRhdGEucmVzdWx0cztcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuXG4gICAgLy8gICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJDb3VudCgpIHtcbiAgICAvLyAgICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgLy8gICAgICAgICByZXR1cm4gZ2V0QXZlbmdlcnNDYXN0KClcbiAgICAvLyAgICAgICAgICAgICAudGhlbihnZXRBdmVuZ2Vyc0Nhc3RDb21wbGV0ZSlcbiAgICAvLyAgICAgICAgICAgICAuY2F0Y2goZXhjZXB0aW9uLmNhdGNoZXIoJ1hIUiBGYWlsZWQgZm9yIGdldEF2ZW5nZXJDb3VudCcpKTtcblxuICAgIC8vICAgICAgICAgZnVuY3Rpb24gZ2V0QXZlbmdlcnNDYXN0Q29tcGxldGUgKGRhdGEpIHtcbiAgICAvLyAgICAgICAgICAgICBjb3VudCA9IGRhdGEubGVuZ3RoO1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKGNvdW50KTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuXG4gICAgLy8gICAgIGZ1bmN0aW9uIGdldEF2ZW5nZXJzQ2FzdCgpIHtcbiAgICAvLyAgICAgICAgIHZhciBjYXN0ID0gW1xuICAgIC8vICAgICAgICAgICAgIHtuYW1lOiAnUm9iZXJ0IERvd25leSBKci4nLCBjaGFyYWN0ZXI6ICdUb255IFN0YXJrIC8gSXJvbiBNYW4nfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ0NocmlzIEhlbXN3b3J0aCcsIGNoYXJhY3RlcjogJ1Rob3InfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ0NocmlzIEV2YW5zJywgY2hhcmFjdGVyOiAnU3RldmUgUm9nZXJzIC8gQ2FwdGFpbiBBbWVyaWNhJ30sXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdNYXJrIFJ1ZmZhbG8nLCBjaGFyYWN0ZXI6ICdCcnVjZSBCYW5uZXIgLyBUaGUgSHVsayd9LFxuICAgIC8vICAgICAgICAgICAgIHtuYW1lOiAnU2NhcmxldHQgSm9oYW5zc29uJywgY2hhcmFjdGVyOiAnTmF0YXNoYSBSb21hbm9mZiAvIEJsYWNrIFdpZG93J30sXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdKZXJlbXkgUmVubmVyJywgY2hhcmFjdGVyOiAnQ2xpbnQgQmFydG9uIC8gSGF3a2V5ZSd9LFxuICAgIC8vICAgICAgICAgICAgIHtuYW1lOiAnR3d5bmV0aCBQYWx0cm93JywgY2hhcmFjdGVyOiAnUGVwcGVyIFBvdHRzJ30sXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdTYW11ZWwgTC4gSmFja3NvbicsIGNoYXJhY3RlcjogJ05pY2sgRnVyeSd9LFxuICAgIC8vICAgICAgICAgICAgIHtuYW1lOiAnUGF1bCBCZXR0YW55JywgY2hhcmFjdGVyOiAnSmFydmlzJ30sXG4gICAgLy8gICAgICAgICAgICAge25hbWU6ICdUb20gSGlkZGxlc3RvbicsIGNoYXJhY3RlcjogJ0xva2knfSxcbiAgICAvLyAgICAgICAgICAgICB7bmFtZTogJ0NsYXJrIEdyZWdnJywgY2hhcmFjdGVyOiAnQWdlbnQgUGhpbCBDb3Vsc29uJ31cbiAgICAvLyAgICAgICAgIF07XG4gICAgLy8gICAgICAgICByZXR1cm4gJHEud2hlbihjYXN0KTtcbiAgICAvLyAgICAgfVxuXG4gICAgLy8gICAgIGZ1bmN0aW9uIHByaW1lKCkge1xuICAgIC8vICAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiBjYW4gb25seSBiZSBjYWxsZWQgb25jZS5cbiAgICAvLyAgICAgICAgIGlmIChwcmltZVByb21pc2UpIHtcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gcHJpbWVQcm9taXNlO1xuICAgIC8vICAgICAgICAgfVxuXG4gICAgLy8gICAgICAgICBwcmltZVByb21pc2UgPSAkcS53aGVuKHRydWUpLnRoZW4oc3VjY2Vzcyk7XG4gICAgLy8gICAgICAgICByZXR1cm4gcHJpbWVQcm9taXNlO1xuXG4gICAgLy8gICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuICAgIC8vICAgICAgICAgICAgIGlzUHJpbWVkID0gdHJ1ZTtcbiAgICAvLyAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJpbWVkIGRhdGEnKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuXG4gICAgLy8gICAgIGZ1bmN0aW9uIHJlYWR5KG5leHRQcm9taXNlcykge1xuICAgIC8vICAgICAgICAgdmFyIHJlYWR5UHJvbWlzZSA9IHByaW1lUHJvbWlzZSB8fCBwcmltZSgpO1xuXG4gICAgLy8gICAgICAgICByZXR1cm4gcmVhZHlQcm9taXNlXG4gICAgLy8gICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7IHJldHVybiAkcS5hbGwobmV4dFByb21pc2VzKTsgfSlcbiAgICAvLyAgICAgICAgICAgICAuY2F0Y2goZXhjZXB0aW9uLmNhdGNoZXIoJ1wicmVhZHlcIiBmdW5jdGlvbiBmYWlsZWQnKSk7XG4gICAgLy8gICAgIH1cblxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnc20uY29yZScpXG4gICAgICAgIC5ydW4oYXBwUnVuKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIGFwcFJ1bihyb3V0ZXJIZWxwZXIpIHtcbiAgICAgICAgdmFyIG90aGVyd2lzZSA9ICcvNDA0JztcbiAgICAgICAgcm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSwgb3RoZXJ3aXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdGF0ZXMoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6ICc0MDQnLFxuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvNDA0JyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9jb3JlLzQwNC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICc0MDQnXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NtLmNoYXQnLCBbXSk7XG59KSgpOyIsIi8qKlxuICogQ3JlYXRlZCBieSBhbGV4YW5kZXJrb3pvdnNraSBvbiA5LzI0LzE1LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdzbS5jaGF0JylcbiAgICAuZGlyZWN0aXZlKCdjaGF0TW9kdWxlJywgY2hhdE1vZHVsZSk7XG5cbmZ1bmN0aW9uIGNoYXRNb2R1bGUoKXtcblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6J0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDonL2NsaWVudC9jb21wb25lbnRzL2NoYXQvY2hhdC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2NoYXRDdHJsJ1xuICAgIH07XG5cblxufSIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnc20uY2hhdCcpXG4gICAgLmNvbnRyb2xsZXIoJ2NoYXRDdHJsJywgY2hhdEN0cmwpO1xuXG4gICAgY2hhdEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRmaXJlYmFzZU9iamVjdCcsJyRmaXJlYmFzZUFycmF5JywgJ0ZJUkVCQVNFX1VSSSddXG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBjaGF0Q3RybCgkc2NvcGUsICRmaXJlYmFzZU9iamVjdCwkZmlyZWJhc2VBcnJheSwgRklSRUJBU0VfVVJJKSB7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGZpcmViYXNlIHJlZmVyZW5jZVxuICAgICAgICB2YXIgY2hhdFJlZiA9IG5ldyBGaXJlYmFzZSAoRklSRUJBU0VfVVJJICsgJ1Nlc3Npb24nICsgJy8nICsgJHNjb3BlLnNlc3Npb25JRCArICcvJyArICdNZXNzYWdlcycpO1xuICAgICAgICB2YXIgdXNlclJlZiA9IG5ldyBGaXJlYmFzZSAoRklSRUJBU0VfVVJJICsgJ1Nlc3Npb24nICsgJy8nICsgJHNjb3BlLnNlc3Npb25JRCArICcvJyArICdVc2VycycpO1xuXG4gICAgICAgICRzY29wZS51c2VyID0gMDtcbiAgICAgICAgJHNjb3BlLnZvdGVBcnIgPSBbXTtcblxuICAgICAgICAvL2NyZWF0ZSBhbm9uIHVzZXIgd2l0aCB1aWQgYW5kIGxpbWl0IHNlc3Npb24gdG8gYnJvd3NlciBvcGVuIG9ubHkuXG4gICAgICAgICRzY29wZS5hdXRoQW5vblVzZXI9IGZ1bmN0aW9uKHVzZXJuYW1lKXtcbiAgICAgICAgICAgIGNoYXRSZWYuYXV0aEFub255bW91c2x5KGZ1bmN0aW9uKGVycm9yLCBhdXRoRGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gRmFpbGVkIVwiLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgIHVzZXJSZWYucHVzaCh7aWQ6YXV0aERhdGEudWlkLCBuYW1lOnVzZXJuYW1lLCB0b2tlbjphdXRoRGF0YS50b2tlbn0pO1xuICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9nZ2VkIGluIGFzOlwiLCBhdXRoRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51c2VyID0gYXV0aERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZW1lbWJlcjogXCJzZXNzaW9uXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAkc2NvcGUubWVzc2FnZXMgPSAkZmlyZWJhc2VBcnJheShjaGF0UmVmKTtcblxuICAgICRzY29wZS5hZGRNZXNzYWdlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2VzLiRhZGQoe1xuICAgICAgICAgICAgdGV4dDokc2NvcGUubmV3TWVzc2FnZVRleHQsXG4gICAgICAgICAgICBpZDogJHNjb3BlLnVzZXIudWlkLFxuICAgICAgICAgICAgbmFtZTogJHNjb3BlLnVzZXJuYW1lLFxuICAgICAgICAgICAgdm90ZXM6IHt9LFxuICAgICAgICAgICAgdGltZTpGaXJlYmFzZS5TZXJ2ZXJWYWx1ZS5USU1FU1RBTVBcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vZm9ybWF0IFRpbWUgZnJvbSBVTklYIHRvIGh1bWFuIHJlYWRhYmxlXG4gICAgJHNjb3BlLmZvcm1hdFRpbWUgPSBmdW5jdGlvbih0aW1lc3RhbXApIHtcbiAgICAgICAgdmFyIGRhdGUgPSAodGltZXN0YW1wKSA/IG5ldyBEYXRlKHRpbWVzdGFtcCkgOiBuZXcgRGF0ZSgpLFxuICAgICAgICBob3VycyA9IGRhdGUuZ2V0SG91cnMoKSB8fCAxMixcbiAgICAgICAgbWludXRlcyA9ICcnICsgZGF0ZS5nZXRNaW51dGVzKCksXG4gICAgICAgIGFtcG0gPSAoZGF0ZS5nZXRIb3VycygpID49IDEyKSA/ICdwbScgOiAnYW0nO1xuXG4gICAgICAgIGhvdXJzID0gKGhvdXJzID4gMTIpID8gaG91cnMgLSAxMiA6IGhvdXJzO1xuICAgICAgICBtaW51dGVzID0gKG1pbnV0ZXMubGVuZ3RoIDwgMikgPyAnMCcgKyBtaW51dGVzIDogbWludXRlcztcbiAgICAgICAgcmV0dXJuICcnICsgaG91cnMgKyAnOicgKyBtaW51dGVzICsgYW1wbTtcbiAgICB9O1xuXG4gICAgLy9saXN0ZW4gZm9yIGNoYW5nZXMgdG8gbW9kZWwgYW5kIHB1bGwgdXNlciBuYW1lXG4gICAgY2hhdFJlZi5vbihcImNoaWxkX2FkZGVkXCIsIGZ1bmN0aW9uKHNuYXBzaG90LCBwcmV2Q2hpbGRLZXkpIHtcbiAgICAgICAgdmFyIG5ld01lc3NhZ2UgPSBzbmFwc2hvdC52YWwoKTtcbiAgICAgICAgJHNjb3BlLm5hbWUgPSBuZXdNZXNzYWdlLm5hbWU7XG4gICAgfSk7XG5cbiAgICAvLyBDdXN0b20gRmlsdGVyXG5cbiAgICAvL1Vwdm90ZSBmdW5jdGlvblxuICAgICRzY29wZS5lcnJvcj0gZmFsc2U7XG4gICAgJHNjb3BlLnZvdGVkID0gZmFsc2U7XG5cbiAgICAkc2NvcGUudXBWb3RlID0gZnVuY3Rpb24oaW5kZXgsIG1lc3NhZ2Upe1xuICAgICAgICBpZighJHNjb3BlLnVzZXIpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID10cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnVzZXIudWlkLCBcIlVJRFwiKTtcbiAgICAgICAgICAgIGlmICghbWVzc2FnZS52b3Rlcykge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2Uudm90ZXMgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1lc3NhZ2Uudm90ZXNbJHNjb3BlLnVzZXIuYXV0aC51aWRdKTtcbiAgICAgICAgICAgIG1lc3NhZ2Uudm90ZXNbJHNjb3BlLnVzZXIuYXV0aC51aWRdID0gISgkc2NvcGUudXNlci5hdXRoLnVpZCBpbiBtZXNzYWdlLnZvdGVzKSA/IDAgOiBtZXNzYWdlLnZvdGVzWyRzY29wZS51c2VyLmF1dGgudWlkXSArIDE7XG4gICAgICAgICAgICBtZXNzYWdlLnZvdGVjb3VudCA9IE9iamVjdC5rZXlzKG1lc3NhZ2Uudm90ZXMpLmxlbmd0aDtcbiAgICAgICAgICAgICRzY29wZS52b3RlQXJyLnB1c2gobWVzc2FnZS52b3RlY291bnQpO1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2VzLiRzYXZlKGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCc7XG5cdGFuZ3VsYXIubW9kdWxlKCdzbS5hZG1pbicsW10pO1xufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uYWRtaW4nKVxuXHRcdC5ydW4oYXBwUnVuKTtcblxuXHRcdGZ1bmN0aW9uIGFwcFJ1bihyb3V0ZXJIZWxwZXIpe1xuXHRcdFx0cm91dGVySGVscGVyLmNvbmZpZ3VyZVN0YXRlcyhnZXRTdGF0ZXMoKSk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldFN0YXRlcygpe1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0YXRlOiAnaWRlYXMnLFxuXHRcdFx0XHRcdGNvbmZpZzoge1xuXHRcdFx0XHRcdFx0dXJsOiAnL2lkZWFzJyxcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdBZG1pbkNvbnRyb2xsZXInLFxuXHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdjbGllbnQvY29tcG9uZW50cy9hZG1pbi9hZG1pbi5odG1sJyxcblx0XHRcdFx0XHRcdGF1dGhlbnRpY2F0ZTogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc20uYWRtaW4nKVxuXHRcdC5jb250cm9sbGVyKCdBZG1pbkNvbnRyb2xsZXInLCBBZG1pbkNvbnRyb2xsZXIpO1xuXG5cdFx0QWRtaW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsJyRyb290U2NvcGUnLCckZmlyZWJhc2VPYmplY3QnLCckZmlyZWJhc2VBcnJheScsJ0ZJUkVCQVNFX1VSSSddO1xuXG5cdFx0ZnVuY3Rpb24gQWRtaW5Db250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSwgJGZpcmViYXNlT2JqZWN0LCAkZmlyZWJhc2VBcnJheSwgRklSRUJBU0VfVVJJKXtcblx0XHRcdHZhciBldmVudFJlZiA9IG5ldyBGaXJlYmFzZShGSVJFQkFTRV9VUkkgKyAnU2Vzc2lvbicpO1xuXG4gICAgICAgICAgICAvL2luc3RhdGlhdGUgc2Vzc2lvbiBvYmplY3QgYW5kIGFkZCB0byAkc2NvcGVcbiAgICAgICAgICAgICRzY29wZS5zZXNzaW9uID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6XCJcIixcbiAgICAgICAgICAgICAgICBwcmVzZW50ZXI6XCJcIixcbiAgICAgICAgICAgICAgICBkZXNjOlwiXCIsXG4gICAgICAgICAgICAgICAgdGltZTpcIlwiLFxuICAgICAgICAgICAgICAgIGltZ1VybDpcIlwiXG4gICAgICAgICAgICB9O1xuXG5cblx0XHRcdCRzY29wZS5zZXNzaW9ucyA9ICRmaXJlYmFzZUFycmF5KGV2ZW50UmVmKTtcblxuXG5cdFx0fVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc20nLCBbXG5cbiAgICAgICAgJ3VpLnJvdXRlcicsXG4gICAgICAgICdmaXJlYmFzZScsXG5cbiAgICAgICAgLypcbiAgICAgICAgICogT3JkZXIgaXMgbm90IGltcG9ydGFudC5cbiAgICAgICAgICogRXZlcnlib2R5IGhhcyBhY2Nlc3MgdG8gdGhlc2UuXG4gICAgICAgICAqIFdlIGNvdWxkIHBsYWNlIHRoZXNlIHVuZGVyIGV2ZXJ5IGZlYXR1cmUgYXJlYSxcbiAgICAgICAgICogYnV0IHRoaXMgaXMgZWFzaWVyIHRvIG1haW50YWluLlxuICAgICAgICAgKi8gXG4gICAgICAgICBcbiAgICAgICAgJ3NtLmNvcmUnLFxuICAgICAgICAnc20ucm91dGVyJyxcbiAgICAgICAgJ25nRmlsZVVwbG9hZCcsXG5cbiAgICAgICAgLypcbiAgICAgICAgICogRmVhdHVyZSBhcmVhc1xuICAgICAgICAgKi9cbiAgICAgICAgIFxuICAgICAgICAnc20uYWRtaW4nLFxuICAgICAgICAnc20uYWRtaW5DcmVhdGUnLFxuICAgICAgICAnc20uY2MnLFxuICAgICAgICAnc20uY2hhdCcsXG4gICAgICAgICdzbS5zZXNzaW9uJyxcbiAgICAgICAgJ3NtLnNpZ25pbicsXG4gICAgICAgICdzbS5zaWdudXAnLFxuICAgICAgICAnc20uZXZlbnQnLFxuICAgICAgICAnc20ucGFydGljaXBhbnQnLFxuICAgICAgICAnc20uc2lnbmluJ1xuICAgIF0pXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzbS5maXJlYmFzZScsW10pXG4gICAgXHQuY29uc3RhbnQoJ0ZJUkVCQVNFX1VSSScsICdodHRwczovL2x1bWlub3VzLWluZmVybm8tNjQwLmZpcmViYXNlaW8uY29tJyk7XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9