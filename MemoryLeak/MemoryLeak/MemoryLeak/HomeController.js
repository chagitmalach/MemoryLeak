




angular.module("myApp").controller('homeController', function ($scope) {
    
    $scope.value = '30';
    $scope.options = {
        min: -1,
        max: 100,
        step: '1',
        decimals: '0',
        format: 'n0'
    };

    $scope.onSpin = function () {

        var value = parseFloatInCurrentLocale($scope.numericTextBox.value());;

        $scope.controlValue = value;
    };

    var parseFloatInCurrentLocale = function (num) {
        return kendo.parseFloat(num);
    };

    $scope.validateOnLostFocus = function () {

        //if ($scope.onBlur != 'undefined') {
        //    $scope.onBlur();
        //}
        if ($scope.controlValue != $scope.numericTextBox.value())
            $scope.controlValue = $scope.numericTextBox.value();

    };
});













