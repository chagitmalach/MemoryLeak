//define(['modules/platform/platformModule'], function () {
angular.module("myApp").directive('w6NumericTextbox', function () {

    var w6NumericTextbox = {};

    w6NumericTextbox.restrict = 'E';

    w6NumericTextbox.require = 'ngModel';

    w6NumericTextbox.template = '<input kendo-numeric-text-box="numericTextBox" ng-model="controlValue" \
                                      ng-disabled="readOnly" maxlength="11" \
                                       ng-keyup="onValueChange($event)" ng-blur="validateOnLostFocus()" />';

    //#region scope 

    w6NumericTextbox.scope = {

        value: "=ngModel",

        readOnly: "=ngReadonly",

        onChange: "&change",

        onBlur: "&?blur",

        minimum: "=?",

        maximum: "=?",

        step: "=?",

        decimals: "=?",

        format: "=?"
    };

    //#endregion 

    w6NumericTextbox.link = function (scope, element, attributes, controller) {

        //#region scope functions

        // set the model value as integer on typing a value in the control
        scope.onValueChange = function (event) {

            var value = event.target.value;

            if (!value) return;

            var lastChar = value.toString().substr(value.length - 1);

            var separator = ',';

            /* do not set value if the last entered character is minus, or if it is point, or if 0 is entered after the point
               because setting the model value will remove this character from view */
            if (lastChar === '-' ||
                lastChar === separator ||
                (value.toString().indexOf(separator) !== -1 && lastChar === '0')) return;

            value = parseFloatInCurrentLocale(value);

            setModelValue(value);
        };

        // update the scope value with the control value on spin (using the up & down arrows)
        scope.onSpin = function () {

            var value = parseFloatInCurrentLocale(scope.numericTextBox.value());;

            scope.controlValue = value;
        };

        // validate that the value is in the allowed range on losing focus
        scope.validateOnLostFocus = function () {

            if (scope.onBlur != 'undefined') {
                scope.onBlur();
            }
            if (scope.controlValue != scope.numericTextBox.value())
                scope.controlValue = scope.numericTextBox.value();

        };

        //#endregion

        //#region private members

        /* the empty value (to be displayed when there is no other value) should be 0 
           or the minimum value if 0 is not in the allowed range */
        var emptyValue = 0;

        var MAX_LONG_NUMBER = 2147483647;

        var MIN_LONG_NUMBER = -2147483647;
        //#endregion

        //#region private functions

        var initialize = function () {

            setDefaultAttributesValues();

            setWidgetOptions();

            if (scope.numericTextBox) {
                initializeControl();
            }

            else {
                scope.$on("kendoWidgetCreated", initializeControl);
            }

            Object.defineProperty(scope, 'controlValue', {

                get: function () {

                    if (angular.isFunction(scope.value)) {
                        return scope.value();
                    }

                    return scope.value;
                },

                set: function (value) {

                    value = validateValue(value);

                    if (scope.numericTextBox && value != scope.numericTextBox.value()) {
                        scope.numericTextBox.value(value);
                    }

                    setModelValue(value);
                }
            });
        };

        var setDefaultAttributesValues = function () {

            scope.step = scope.step || '1';

            scope.decimals = scope.decimals || '0';

            scope.format = scope.format || 'n0';

            scope.onBlur = scope.onBlur || 'undefined';

            scope.maximumValue = getMaximumValue();

            scope.minimumValue = getMinimumValue();

            if (scope.minimumValue > 0 || scope.maximumValue < 0) {
                emptyValue = parseFloatInEnglishLocale(scope.minimumValue)
            }
        };

        var getMaximumValue = function () {

            var max = parseFloatInEnglishLocale(scope.maximum);

            if (max == null || max > MAX_LONG_NUMBER) {
                return MAX_LONG_NUMBER;
            }
            else {
                return max;
            }
        };

        var getMinimumValue = function () {

            var min = parseFloatInEnglishLocale(scope.minimum);

            if (min == null || min < MIN_LONG_NUMBER) {
                return MIN_LONG_NUMBER;
            }
            else {
                return min;
            }
        };

        var setWidgetOptions = function () {

            scope.options = {
                min: scope.minimumValue,
                max: scope.maximumValue,
                step: scope.step,
                decimals: scope.decimals,
                format: scope.format
            };

            if (scope.numericTextBox) {
                scope.numericTextBox.setOptions(scope.options);
            }
        };

        var initializeControl = function () {

            //in case the maximum value is undefined ang get a defualt value

            if (scope.maximum != scope.numericTextBox.max) {

                scope.maximumValue = getMaximumValue();
                scope.numericTextBox.setOptions({ max: scope.maximumValue });

            }
            //in case the minimum value is undefined ang get a defualt value

            if (scope.minimum != scope.numericTextBox.min) {

                scope.minimumValue = getMinimumValue();
                scope.numericTextBox.setOptions({ min: scope.minimumValue });

            }

            var unbindWatch = scope.$watch('value', function () {

                if (angular.isDefined(scope.value)) {

                    var value = scope.value;

                    if (angular.isFunction(scope.value)) {
                        value = scope.value();
                    }

                    //  scope.controlValue = value;

                    value = validateValue(value);

                    if (angular.isFunction(scope.value)) {
                        scope.value(value);
                    }
                    else {
                        scope.value = value;
                    }

                    unbindWatch();
                };
            });
        };

        var applyScopeValue = function (value) {

            controller.$setViewValue(value);

            scope.onChange();
        };

        var setModelValue = function (value) {

            if (angular.isFunction(scope.value)) {

                scope.value(value);

                scope.onChange();
            }

            else {
                scope.value = value;

                applyScopeValue(value);
            }
        };

        var validateValue = function (value) {

            if (angular.isString(value)) {
                value = parseFloatInCurrentLocale(value);
            }

            if (isNaN(value) || value == null) {
                value = emptyValue;
            }

            else if (value < scope.minimumValue) {
                value = parseFloatInEnglishLocale(scope.minimumValue);
            }

            else if (value > scope.maximumValue) {
                value = parseFloatInEnglishLocale(scope.maximumValue);
            }

            return value;
        };

        var parseFloatInCurrentLocale = function (num) {
            return kendo.parseFloat(num);
        };

        var parseFloatInEnglishLocale = function (num1) {
            if (angular.isString(num1)) {
                return parseFloat(num1.replace(/,/g, ''));
            }
            return num1;
        }

        //#endregion

        initialize();
    };

    return w6NumericTextbox;
});