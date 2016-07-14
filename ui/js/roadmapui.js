

    var roadMapApp = angular.module('RoadMapApp',['ngMaterial','ngRoute']);
    
    roadMapApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'home.html',
                controller  : 'DemoBasicCtrl'
            })

            // route for the about page
            .when('/createTeam', {
                templateUrl : 'createteam.html',
                controller  : 'createTeamController'
            })
            // login fails
            .when('/fail', {
                templateUrl : 'ui/fail.html',
                controller  : 'loginFailController'
            });

    });
    
    roadMapApp.controller('DemoBasicCtrl', function DemoCtrl($mdDialog) {
        this.settings = {
            printLayout: true,
            showRuler: true,
            showSpellingSuggestions: true,
            presentationMode: 'edit'
        };

        this.sampleAction = function(name, ev) {
            $mdDialog.show($mdDialog.alert()
            .title(name)
            .textContent('You triggered the "' + name + '" action')
            .ok('Great')
            .targetEvent(ev)
            );
        };
    });
    
    roadMapApp.controller('createTeamController', function($scope) {
       $scope.message = 'Create Team!'; 
    });
    
    roadMapApp.controller('loginFailController', function($scope) {
       $scope.message = 'Please, Sign In.'; 
    });
    
    roadMapApp.controller('DemoBasicCtrl', function($scope, $http) {
        $http.get("/api/v1/me").then(function (response) {
            $scope.userName = response.data.user.profile.username;
            $scope.loggedIn = $scope.userName !== null;
        });
    });
    
    
