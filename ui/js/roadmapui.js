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
    
    roadMapApp.config(function($mdIconProvider) {
      $mdIconProvider.defaultIconSet('img/icons/sets/core-icons.svg', 24);
    })
    .controller('DemoBasicCtrl', function DemoCtrl($mdDialog) {
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
