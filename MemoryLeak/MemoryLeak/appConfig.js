
angular.module("myApp").config(function ($routeProvider) {
    $routeProvider

        .when("/empty", {
            templateUrl: 'Empty.html'
        })
        .when("/withNumbericTextbox", {
            templateUrl: 'WithNumbericTextbox.html',
            controller: 'homeController'
        });


});