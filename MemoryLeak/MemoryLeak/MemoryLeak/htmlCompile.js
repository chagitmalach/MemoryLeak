
angular.module("myApp").directive('htmlCompile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        var unbindWatch = scope.$watch(
            function (scope) {
                // watch the 'htmlCompile' expression for changes
                return scope.$eval(attrs.htmlCompile);
            },
            function (value) {

                if (value) {


                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);

                    scope.$emit('onContentCompiled');

                    if (!attrs.shouldKeepWatch) {
                        unbindWatch();
                    }
                }
            }
        );
    }
}]);

