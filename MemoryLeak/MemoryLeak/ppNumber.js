//define(['modules/platform/platformModule'], function () {
angular.module("myApp").directive('ppNumber', ['$timeout', function ($timeout) {

    var ppNumber = {};

    ppNumber.restrict = 'E';

    ppNumber.require = 'ngModel';

    //ppNumber.templateUrl = "modules/platform/propPanels/templates/ppNumberTemplate.html";

    ppNumber.template = `<div ng-show="visible=='true'" class="propPanelContainer ppNumber ng-hide">

        <span class="mandatoryIcon" ng-show="mandatory=='true' && readOnly=='false'">*</span>

        <input type="checkbox" class="ppCheckBox" ng-if="showChangeIndication==true" ng-model="indicatePropertyChanged.checked" ng-click="indicatePropertyChanged(indicatePropertyChanged.checked)" />

        <label  ng-if="label != ''" ng-class="{'ppLabelWithCheckbox':showChangeIndication==true}" class="propPanelLabelOverflow propPanelLabel"  >kendo numric text box</label>

        <div ng-class="{'ppInputWithCheckBox':showChangeIndication==true}">

            <w6-numeric-textbox ng-model="value" change="onChange()" ng-readonly="readOnly=='true'"
                minimum="minimum" maximum="maximum" step="step"
                decimals="decimals" format="format"
                ng-class="{'ppNumeric': true, 'error-input': formSubmitted && mandatory == 'true' && ngModel.$invalid }"></w6-numeric-textbox>
        </div>

        <div ng-show="formSubmitted && ngModel.$invalid &&  mandatory == 'true'">
            <p class="formValidationMessage">mandatory</p>
        </div>
    </div>`;


    //#region scope

    ppNumber.scope = {

        value: "=ngModel",

        propertyName: "@",

        label: "@?",

        visible: "@?",

        readOnly: "@?",

        mandatory: "@?",

        defaultValue: "@?",

        state: "=?",

        minimum: "@?",

        maximum: "@?",

        step: "@?",

        decimals: "@?",

        format: "@?",

        strings: "=",

        focusId: "@?",

        showChangeIndication: "=?"


    };

    //#endregion

    ppNumber.link = function (scope, element, attributes, ngModelController) {

        //#region scope functions   

        scope.ngModel = ngModelController;

        scope.$on("formSubmitted", function (event, data) {
            scope.formSubmitted = true;
        });

        scope.indicatePropertyChanged = {};

        scope.onChange = function () {

            scope.$emit('notifyPropertyChanged', {
                propertyName: scope.propertyName,
                isChangedFromUser: true
            });

            if (!scope.indicatePropertyChanged.checked)
                scope.indicatePropertyChanged(true);
        };

        scope.indicatePropertyChanged = function (checked) {

            ngModelController.$validate();

            scope.$emit('indicatePropertyChanged', {
                propertyName: scope.propertyName,
                checked: checked
            });
            scope.indicatePropertyChanged.checked = checked;

            if (scope.value == undefined) {
                scope.value = 0;
                scope.onChange();
            }
        }

        scope.$on("onFocusRequested", function (event, data) {

            if (data.focusId == scope.focusId) {
                $timeout(function () {
                    element.find('w6-numeric-textbox').find('input').focus();
                }, 0);
            }


        });

        //#endregion

        //#region private functions

        var initialize = function () {

            setDefaultAttributesValues();

            setDefaultValueInCreateMode();
        }

        var setDefaultAttributesValues = function () {

            scope.label = scope.label || '';

            scope.visible = scope.visible || 'true';

            scope.readOnly = scope.readOnly || 'false';

            scope.mandatory = scope.mandatory || 'false';

            scope.state = scope.state || 'edit';

            scope.showChangeIndication = scope.showChangeIndication || 'false';
        }

        var setDefaultValueInCreateMode = function () {

            if (scope.state == 'create' && angular.isUndefined(scope.value)) {

                if (angular.isDefined(scope.defaultValue)) {
                    scope.value = parseFloatWithCommas(scope.defaultValue);
                }
                else {

                    if (scope.minimum > 0 || scope.maximum < 0) {
                        scope.value = parseFloatWithCommas(scope.minimum);
                    }

                    else {
                        scope.value = 0;
                    }
                }
            }
        };

        //#endregion
        var parseFloatWithCommas = function (str) {
            if (angular.isString(str)) {
                return parseFloat(str.replace(/,/g, ''));
            }
            return str;
        };

        initialize();
    };

    return ppNumber;
}]);
