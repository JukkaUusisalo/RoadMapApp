

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
    
    roadMapApp.controller('DemoBasicCtrl', function DemoCtrl($scope,$http) {
        this.settings = {
            printLayout: true,
            showRuler: true,
            showSpellingSuggestions: true,
            presentationMode: 'edit'
        };
        
        $http.get("/api/v1/team").then(function (response) {
            $scope.teamList = response.data.teams;   
            console.log(response.data);
        });

    });
    
    roadMapApp.controller('createTeamController', function($scope) {
       $scope.message = 'Create Team!'; 
    });
    
    roadMapApp.controller('loginFailController', function($scope) {
       $scope.message = 'Please, Sign In.'; 
    });
    
    roadMapApp.controller('DemoBasicCtrl', function($scope, $http) {
        $http.get("/api/v1/me").then(function (response) {
            $scope.user = response.data.user;            
            $scope.loggedIn = 
                    ($scope.user !==null) &&
                    ($scope.user.profile.username !== null);
        });
        
        $http.get("/api/v1/team").then(function (response) {
            $scope.teamList = response.data.teams;   
            console.log(response.data);
        });
        
        $scope.selectTeam = function (teamName) {
            $http.get("/api/v1/team/"+teamName).then(function (response) {
                $scope.currentTeam = response.data.team;   
                console.log(response.data);
            });           
        }

    });
    
    roadMapApp.controller('createTeamContoller', function($scope, $http) {
        
        
        $scope.submitForm = function() {

            var teamData = $scope.form;
            var administrators = [{user:$scope.user}];
            teamData['adminUsers'] = administrators;           

            $http({
                url: "/api/v1/team",
                data: JSON.stringify(teamData),
                method: 'POST',
                headers : 
                    {'Content-Type':'application/json; charset=UTF-8'}
            }).success(function(data){
                console.log("OK", data);
            }).error(function(err){
                "ERR", console.log(err);
            });                
        };
    });

    
    
