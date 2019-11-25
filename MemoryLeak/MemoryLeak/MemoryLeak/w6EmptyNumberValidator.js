angular.module("myApp").directive('w6EmptyNumberValidator', function () {

    var isEmptyNumberValidator = {};

    isEmptyNumberValidator.restrict = 'A';

    isEmptyNumberValidator.require = 'ngModel';

    isEmptyNumberValidator.link = function (scope, element, attributes, ngModelController) {

        ngModelController.$validators.isEmpty = function (modelValue, viewValue) {

            var checkbox = element.find('input[type = checkbox]')[0];


            if (!attributes.showChangeIndication || (attributes.showChangeIndication && checkbox && checkbox.checked)) {
                if (attributes.readOnly == 'true' || attributes.visible == 'false') return true;

                if (attributes.mandatory == 'true' && (modelValue == undefined || modelValue == 0)) return false;
            }

            return true;
        };

    };

    return isEmptyNumberValidator;

});