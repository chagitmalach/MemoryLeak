angular.module("myApp").directive('w6ExpressionObserver', function () {

    var w6ExpressionObserver = {};

    w6ExpressionObserver.restrict = 'A';

    w6ExpressionObserver.require = 'ngModel';

    w6ExpressionObserver.link = function (scope, element, attributes, ngModelController) {

        attributes.$observe('mandatory', function () {
            ngModelController.$validate();
        });

        attributes.$observe('readOnly', function () {
            ngModelController.$validate();
        });

        attributes.$observe('visible', function () {
            ngModelController.$validate();
        });
    };

    return w6ExpressionObserver;

});