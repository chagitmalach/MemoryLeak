angular.module('myApp').factory('w6lazyLoader', ['$ocLazyLoad', function ($ocLazyLoad) {
    var service =
    {
        load: function (toLoad) {

            var objJson = angular.toJson(toLoad);

            

            var finished = function () {
               
            };
            var error = function (errorMsg) {

                console.error(errorMsg)
            };

            var loadRequest = $ocLazyLoad.load(toLoad);

            loadRequest.then(finished, error);

            return loadRequest;
        },
    };

    return service;
}]);
