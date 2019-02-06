(function () {
    'use strict';
 
    var accMod = angular.module('acc', ['ngAnimate', 'ui.bootstrap']);   
    accMod.directive('accord', function () {
        var scope = {
            datasource: '='
        };
 
        return {            
            templateUrl: 'accord.html',      
            scope: scope
        };
    });
 
 
    var mod = angular.module('ui.bootstrap.app', ['acc', 'ngSanitize']);
    mod.controller('workExperienceController', ['$scope', '$http', function($scope, $http){
        $http.get('./workExperience.json')
            .then(function(res){
                $scope.workExperienceDataSource = res.data;
            });
    }]); 
     
}());