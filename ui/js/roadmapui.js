/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

   /**
     * You must include the dependency on 'ngMaterial' 
     */
    
    //var roadMapApp = angular.module('RoadMapApp',['ngMaterial','ngMessages','ngRoute', 'material.svgAssetsCache']);
    var roadMapApp = angular.module('RoadMapApp',['ngMaterial']);
    
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
    
    roadMapApp.controller('DemoBasicCtrl', function($scope, $http) {
        $http.get("/api/v1/me").then(function (response) {
            $scope.userName = response.data.user.profile.username;
            $scope.loggedIn = $scope.userName != null;
        });
    });
