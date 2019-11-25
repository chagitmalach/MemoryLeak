

//angular.module("myApp").directive('w6Form', ['$filter', '$location', '$q', '$rootScope', '$timeout', '$injector', 'w6keyRefrenceService', 'w6localization', 'w6log', 'w6pushNotificationService', 'w6schemeObjectsDictionaryCache', 'w6serverServices', 'w6utils', 'prompt', 'w6dialogService', 'w6AuditService', 'w6analytics', 'w6featureTogglingServices', 'w6xml2JsonService', 'w6schemaServices', 'w6lazyLoader', 'w6studioSettings',
//        function ($filter, $location, $q, $rootScope, $timeout, $injector, w6keyRefrenceService, w6localization, w6log, w6pushNotificationService, w6schemeObjectsDictionaryCache, w6serverServices, w6utils, prompt, w6dialogService, w6AuditService, w6analytics, w6featureTogglingServices, w6xml2JsonService, w6schemaServices, w6lazyLoader, w6studioSettings) {
angular.module("myApp").directive('w6Form', ['$filter', '$location', '$q', '$rootScope', '$timeout', '$injector',
    function ($filter, $location, $q, $rootScope, $timeout, $injector) {

        //var moment = require('moment');
        var w6Form = {};
        var arrPropExpression;

        w6Form.restrict = 'E';

        w6Form.template = `<div id="platformForm"> 
                                <div id="headerPlaceHolder">
                                    <div id="platformHeaderContainer" ng-if="formHeader"> 
                                        <div id="platformBigTitle"> 
                                            <h1 class="platformBigTitleCaption" ng-bind="formHeader"></h1> 
                                        </div> 
                                    </div> 
                                </div> 
                                <div class="formContainer" ng-class="{formContainerNoConfiguration: !hasFormConfiguration}"> 
                                    <w6-alert type="alertType" message="alertMessage"></w6-alert> 
                                    <form name="form"class="fullHeight">
        <div class="fullHeight">
                <tabset class="fullHeight">
                    <tab heading="Tab 1" ng-click="enterTab('Tab_1')" ng-show="!hiddenTabs['Tab_1'] && true" active="metaData[0].active">
                        <div ng-show="!hiddenTabs['Tab_1'] && true">
                            <ng-form name="Tab_1" focus-first-control="{{metaData[0].active}}" focus-if-invalid="{{metaData[0].active}}">
                                <div class="row">
                                    <div class="col-sm-0 col-md-0 col-lg-0">
                                    </div>
                                </div>
                            </ng-form>
                        </div>
                    </tab>
                    <tab heading="Tab 2" ng-click="enterTab('Tab_2')" ng-show="!hiddenTabs['Tab_2'] && true" active="metaData[1].active">
                        <div ng-show="!hiddenTabs['Tab_2'] && true">
                            <ng-form name="Tab_2" focus-first-control="{{metaData[1].active}}" focus-if-invalid="{{metaData[1].active}}">
                                <div class="row">
                                    <div class="col-sm-12 col-md-12 col-lg-12">
                                        <pp-number minimum="0" maximum="100" step="1" ng-model="object.SameSiteTimeRadius" property-name="SameSiteTimeRadius" focus-id="1" label="SameSiteTimeRadius" read-only="false" mandatory="false" default-value="" visible="{{ !hiddenPropPanels['SameSiteTimeRadius'] && true }}" enabled="true" grid.-row-span="1" grid.-column-span="1" property-type="3" ng-model-options="{allowInvalid: true }" w6-empty-number-validator="" w6-expression-observer="" decimals="0" format="n0" class="propPanels" strings="moduleStrings" state="formState">_</pp-number>
                                </div>\
						</div>
                            <div class="row">
                                <div class="col-sm-12 col-md-12 col-lg-12">
                                    <pp-number minimum="0" maximum="100" step="1" ng-model="object.SameSiteDistanceRadius" property-name="SameSiteDistanceRadius" focus-id="2" label="SameSiteDistanceRadius" read-only="false" mandatory="false" default-value="" visible="{{ !hiddenPropPanels['SameSiteDistanceRadius'] && true }}" enabled="true" grid.-row-span="1" grid.-column-span="1" property-type="3" ng-model-options="{allowInvalid: true }" w6-empty-number-validator="" w6-expression-observer="" decimals="0" format="n0" class="propPanels" strings="moduleStrings" state="formState">_</pp-number>
                            </div>
                        </div>
					</ng-form>
				</div>
			</tab >
		</tabset >
                    <div class="formBottomButtons">
            <div class="formBottomButtonsRight">
                <button type="button" ng-click="onOKClick()" class="btn btn-primary formBottomBtn" ng-show="true" id="formOKButton">{{::moduleStrings.FormOKButton}}</button>
                <button type="button" ng-click="onApplyClick()" class="btn btn-default formBottomBtn" ng-show="true" id="formApplyButton" ng-disabled="!form.$dirty">{{::moduleStrings.FormApplyButton}}</button>
                <button type="button" ng-click="onCancelClick()" class="btn btn-default formBottomBtn" ng-show="true" id="formCancelButton" ng-disabled="isRequestInProgress">{{::moduleStrings.FormCancelButton}}</button>
            </div>
        </div>
	</div >
</div >
        </form > 
                                </div> 
                           </div>`;


        //#region scope

        w6Form.scope = {

            objectType: "=",

            platformConfigurationObjectType: "=?",

            objectKey: "=",

            moduleStrings: "=?",

            duplicateKey: "=?",

            dependencies: "=?",

            apiObject: "=?",

            allowInnerNavigations: "@?",

            getLocalState: "&?",

            ignoreLocationChange: "&?",

            advancedPlatformOptions: "=?",

            hideAuditTab: "@?",

            objectService: "@?",

            objectServiceFiles: "@?"
        };

        //#endregion

        w6Form.link = function (scope, element, attributes, controller) {

            //#region scope members

            scope.formHeader;

            scope.formSetting;

            scope.hasFormConfiguration;

            scope.metaData = {};

            scope.object = {};

            scope.customPanelsData = {};

            scope.originalObject;

            scope.changedObject = {};

            scope.referencedObjects = {};

            scope.formState;

            scope.hiddenPropPanels = {};

            scope.hiddenTabs = {};

            scope.beforeObjectSavedFunctions = [];

            scope.beforeOKClickFunctions = [];

            scope.beforeApplyClickFunctions = [];

            scope.isRequestInProgress = false;

            scope.loadedTabs = {};

            //#endregion

            //#region private members

            var collectionID;

            var refObjects;

            var newObjectKey = 'new';

            var objectIdentifier = "";

            var advancedFormSettingRequest;

            var advancedFormSetting;

            var identifierDefer = $q.defer();

            var deferredGetFormObject = $q.defer();

            var propertiesInfoPromise = $q.defer();

            var unRegisterLocationChangeEvent;

            var propertiesForAnalytics;

            var propertiesForAnalyticsOnCreate;

            var propertiesInfo;

            var objectService;

            var data = [{
                ActionsPermissions: {},
                AdvancedFormSetting: { "objectType": "53", "htmlForm": "\u003cdiv class=\"fullHeight\"\u003e\u003cdiv class=\"fullHeight\"\u003e\u003ctabset class=\"fullHeight\"\u003e\u003ctab heading=\"Tab 1\" ng-click=\"enterTab(\u0027Tab_1\u0027)\" ng-show=\"!hiddenTabs[\u0027Tab_1\u0027] \u0026\u0026 true\" active=\"metaData[0].active\"\u003e\u003cdiv ng-show=\"!hiddenTabs[\u0027Tab_1\u0027] \u0026\u0026 true\"\u003e\u003cng-form name=\"Tab_1\" focus-first-control=\"{{metaData[0].active}}\" focus-if-invalid=\"{{metaData[0].active}}\"\u003e\u003cdiv class=\"row\"\u003e\u003cdiv class=\"col-sm-0 col-md-0 col-lg-0\"\u003e\u003c/div\u003e\u003c/div\u003e\u003c/ng-form\u003e\u003c/div\u003e\u003c/tab\u003e\u003ctab heading=\"Tab 2\" ng-click=\"enterTab(\u0027Tab_2\u0027)\" ng-show=\"!hiddenTabs[\u0027Tab_2\u0027] \u0026\u0026 true\" active=\"metaData[1].active\"\u003e\u003cdiv ng-show=\"!hiddenTabs[\u0027Tab_2\u0027] \u0026\u0026 true\"\u003e\u003cng-form name=\"Tab_2\" focus-first-control=\"{{metaData[1].active}}\" focus-if-invalid=\"{{metaData[1].active}}\"\u003e\u003cdiv class=\"row\"\u003e\u003cdiv class=\"col-sm-12 col-md-12 col-lg-12\"\u003e\u003cpp-number minimum=\"0\" maximum=\"100\" step=\"1\" ng-model=\"object.SameSiteTimeRadius\" property-name=\"SameSiteTimeRadius\" focus-id=\"1\" label=\"SameSiteTimeRadius\" read-only=\"false\" mandatory=\"false\" default-value=\"\" visible=\"{{ !hiddenPropPanels[\u0027SameSiteTimeRadius\u0027] \u0026\u0026 true }}\" enabled=\"true\" grid.-row-span=\"1\" grid.-column-span=\"1\" property-type=\"3\" ng-model-options=\"{ allowInvalid: true }\" w6-empty-number-validator=\"\" w6-expression-observer=\"\" decimals=\"0\" format=\"n0\" class=\"propPanels\" strings=\"moduleStrings\" state=\"formState\"\u003e_\u003c/pp-number\u003e\u003c/div\u003e\u003c/div\u003e\u003cdiv class=\"row\"\u003e\u003cdiv class=\"col-sm-12 col-md-12 col-lg-12\"\u003e\u003cpp-number minimum=\"0\" maximum=\"100\" step=\"1\" ng-model=\"object.SameSiteDistanceRadius\" property-name=\"SameSiteDistanceRadius\" focus-id=\"2\" label=\"SameSiteDistanceRadius\" read-only=\"false\" mandatory=\"false\" default-value=\"\" visible=\"{{ !hiddenPropPanels[\u0027SameSiteDistanceRadius\u0027] \u0026\u0026 true }}\" enabled=\"true\" grid.-row-span=\"1\" grid.-column-span=\"1\" property-type=\"3\" ng-model-options=\"{ allowInvalid: true }\" w6-empty-number-validator=\"\" w6-expression-observer=\"\" decimals=\"0\" format=\"n0\" class=\"propPanels\" strings=\"moduleStrings\" state=\"formState\"\u003e_\u003c/pp-number\u003e\u003c/div\u003e\u003c/div\u003e\u003c/ng-form\u003e\u003c/div\u003e\u003c/tab\u003e\u003c/tabset\u003e\u003cdiv class=\"formBottomButtons\"\u003e\u003cdiv class=\"formBottomButtonsRight\"\u003e\u003cbutton type=\"button\" ng-click=\"onOKClick()\" class=\"btn btn-primary formBottomBtn\" ng-show=\"true\" id=\"formOKButton\"\u003e{{::moduleStrings.FormOKButton}}\u003c/button\u003e\u003cbutton type=\"button\" ng-click=\"onApplyClick()\" class=\"btn btn-default formBottomBtn\" ng-show=\"true\" id=\"formApplyButton\" ng-disabled=\"!form.$dirty\"\u003e{{::moduleStrings.FormApplyButton}}\u003c/button\u003e\u003cbutton type=\"button\" ng-click=\"onCancelClick()\" class=\"btn btn-default formBottomBtn\" ng-show=\"true\" id=\"formCancelButton\" ng-disabled=\"isRequestInProgress\"\u003e{{::moduleStrings.FormCancelButton}}\u003c/button\u003e\u003c/div\u003e\u003c/div\u003e\u003c/div\u003e\u003c/div\u003e", "metaData": [{ "tabName": "Tab_1", "properties": [], "visable": "!hiddenTabs[\u0027Tab_1\u0027] \u0026\u0026 true", "active": true }, { "tabName": "Tab_2", "properties": [{ "propertyName": "SameSiteTimeRadius", "visable": "true", "readOnly": "false", "mandatory": "false", "focusIndexer": 1, "mandatoryCulomns": null }, { "propertyName": "SameSiteDistanceRadius", "visable": "true", "readOnly": "false", "mandatory": "false", "focusIndexer": 2, "mandatoryCulomns": null }], "visable": "!hiddenTabs[\u0027Tab_2\u0027] \u0026\u0026 true", "active": false }], "refrencObject": [], "formHeader": "District", "arrPropertiesExpression": "{}" }
            }]

            scope.moduleStrings = {
                "FormOKButton": "OK",
                "FormApplyButton": "Apply",
                "FormCancelButton": "Cancel"
            }

            //#endregion

            //#region scope events

            scope.$on('notifyPropertyChanged', function (event, data) {

                if (angular.equals(scope.changedObject, {})) {
                    scope.changedObject["@objectType"] = scope.object["@objectType"];
                    scope.changedObject["Key"] = scope.object["Key"];
                }

                if (data.isFromPushNotipfications) {
                    scope.form.$dirty = false;
                }
                else {
                    scope.form.$setDirty();
                    scope.changedObject[data.propertyName] = data.isChangedFromUser;
                }

                if (data.propertyType == 'key') {
                    var objType = $filter('filter')(refObjects, { "propertyName": data.propertyName });
                    getReferencedObjects(objType);
                }

                if (data.isValidObject == undefined) {
                    /**
                     * @ngdoc event
                     * @name form:notifyPropertyChanged
                     * @eventOf platformModule.object:w6Form
                     * @description Dispatched to both child and parent scopes when the value in a property control changes. If the control is a text box, w6Form dispatches the event for each character that the user types. If the control is an autocomplete box, w6Form dispatches the event only when the control has a valid value that exists in the autocomplete list.
                     *
                     * A custom panel can implement a handler for this event, for example, to verify that the user is entering legal characters, or to copy the user's entries to another property.
                     *
                     * *Note:* Do not confuse the "form:notifyPropertyChanged" event with the "notifyPropertyChanged" event that a custom panel can dispatch back to the w6Form.
                     * @param {string} propertyName The name of the property that the user has edited.
                     * @param {object|integer|boolean|etc} newValue The new property value that the user entered. The data type of this parameter depends on the type of property control.
                     */

                    $timeout(function () {
                        scope.$broadcast('form:notifyPropertyChanged', data.propertyName, scope.object[data.propertyName]);
                        scope.$emit('form:notifyPropertyChanged', data.propertyName, scope.object[data.propertyName]);
                    });
                }
            });

            var unRegisterContentCompiledEvent = scope.$on('onContentCompiled', function () {

                /*Documentation: For Bold.GA, we did not document events that are emitted to parent scopes. Document all the $emit events in the future.*/
                scope.$emit('form:onRenderDone');
                scope.$broadcast('form:onRenderDone');

                unRegisterContentCompiledEvent();
            });

            scope.$on('$destroy', function () {

                /**
                 * @ngdoc event
                 * @name form:onDestroy
                 * @eventOf platformModule.object:w6Form
                 * @description Dispatched to both child and parent scopes when the form object is destroyed. You can use the event to perform clean-up operations.
                 */
                scope.$emit('form:onDestroy');

                scope.$broadcast('form:onDestroy');

                for (var api in scope.apiObject) {
                    delete scope.apiObject[api];
                }

                //if (angular.isFunction(unRegisterLocationChangeEvent)) {

                //    unRegisterLocationChangeEvent();
                //}

                //w6pushNotificationService.unRegister(collectionID, pushNotificationsForm);
            });

            scope.$on('requestCanceled', function () {

                scope.isRequestInProgress = false;
            });

            //#endregion

            //#region scope functions

            scope.onOKClick = function () {

                //w6analytics.track(scope.object["@objectType"] + " Form, On OK");

                //$q.all(getPromises(scope.beforeOKClickFunctions)).then(function () {

                //    $timeout(function () {

                //        var savingResult = saveForm();

                //        if (savingResult) {

                //            savingResult.then(

                //                function sucess(updatedObject) {

                //                    unRegisterLocationChangeEvent();

                //                    /**
                //                     * @ngdoc event
                //                     * @name form:onOKClicked
                //                     * @eventOf platformModule.object:w6Form
                //                     * @description Dispatched to both child and parent scopes after the user clicks the OK button of the form or the Save button in a save prompt, and the form data is successfully saved in the database.
                //                     *
                //                     * @param {string} updatedObject A {@link basicInfo.overview:JSON%20Representation%20of%20Business%20Objects JSON} representation of the object that was saved, including all its properties.
                //                     */
                                    scope.$broadcast('form:onOKClicked', []);
                                    scope.$emit('form:onOKClicked', []);
                //                },

                //                function failure(error) {

                //                    if (error != null) {
                //                        var errorMsg = scope.moduleStrings.UserMessagesSaveObjectFail;

                //                        if (error.data.ExceptionMessage) {
                //                            errorMsg += ' ' + error.data.ExceptionMessage;
                //                        }

                //                        controller.apiObject.showUserMessage('error', errorMsg);
                //                    }
                //                });
                //        }
                //    });
                //});
                $location.path('\empty')

            };

            scope.onApplyClick = function () {

                $location.path('\empty')

                //w6analytics.track(scope.object["@objectType"] + " Form, On Apply");

                //$q.all(getPromises(scope.beforeApplyClickFunctions)).then(function () {

                //    $timeout(function () {

                //        var savingResult = saveForm();

                //        if (savingResult) {

                //            savingResult.then(

                //                function sucess(updatedObject) {

                //                    scope.formState = 'edit';

                //                    scope.duplicateKey = null;

                //                    scope.form.$setPristine();

                //                    scope.changedObject = {};

                //                    scope.originalObject = angular.copy(updatedObject);

                //                    scope.alertMessage = '';

                //                    /*Documentation: Hidden*/
                //                    /*
                //                     * @ngdoc event
                //                     * @name onObjectSaved
                //                     * @eventOf platformModule.object:w6Form
                //                     * @description Dispatched to child scopes after the object displayed on the form is successfully saved to the database.
                //                     */
                //                    //DEPRECATED - remains only for backward compatibility
                //                    scope.$broadcast('onObjectSaved');

                //                    /**
                //                     * @ngdoc event
                //                     * @name form:onApplyClicked
                //                     * @eventOf platformModule.object:w6Form
                //                     * @description Dispatched to both child and parent scopes after the user clicks the Apply button and the form data is successfully saved in the database.
                //                     * @param {object} object A reference to the object that is displayed on the form, in {@link basicInfo.overview:JSON%20Representation%20of%20Business%20Objects JSON} representation. If the user edits the properties on the form, the property values of the object parameter change.
                //                     * @param {object} changedObject This parameter keeps track of the properties displayed on the form that differ from the ones saved in the database. When the form is initialized, changedObject is empty. If the user or the code changes a property, it is added to changedObject with a value of true (meaning that the user changed the value) or false (meaning that the code changed the value). 
                //                     *	
                //                     * For example, if the user edits the Priority property on the form, changedObject.Priority = true. If the code changes the Priority property, changedObject.Priority = false.
                //                     *				 
                //                     * The behavior described here is for regular property controls that appear on the form. If a custom panel changes a property value, it might need to edit changedObject in a different way. For details, consult with ClickSoftware Worldwide Support. 
                //                     * @param {object} customPanelsData This parameter is for internal use only.
                //                     */
                                    scope.$emit('form:onApplyClicked');

                                    scope.$broadcast('form:onApplyClicked');

                //                    scope.resetAuditData();
                //                },

                //                function failure(error) {
                //                    if (scope.object.Key == -1) {
                //                        scope.object.Key = newObjectKey;
                //                    }

                //                    if (error != null) {

                //                        var errorMsg = scope.moduleStrings.UserMessagesSaveObjectFail;

                //                        if (error.data.ExceptionMessage) {
                //                            errorMsg += ' ' + error.data.ExceptionMessage;
                //                        }

                //                        controller.apiObject.showUserMessage('error', errorMsg);
                //                    }
                //                });
                //        }
                //    });
                //});
            };

            scope.onCancelClick = function () {

                $location.path('\empty');

                //if (scope.object != null) {
                //    //w6analytics.track(scope.object["@objectType"] + " Form, On Cancel");
                //}
                //unRegisterLocationChangeEvent();

                ///**
                // * @ngdoc event
                // * @name form:onCancelClicked
                // * @eventOf platformModule.object:w6Form
                // * @description Dispatched to both child and parent scopes after the user clicks the Cancel button, or when the user clicks the Don't Save button in a save prompt.
                // */
                scope.$emit('form:onCancelClicked');

                scope.$broadcast('form:onCancelClicked');
            };

            scope.enterTab = function (tabName) {

                for (var tab in scope.loadedTabs) {
                    scope.loadedTabs[tab] = false;
                }

                scope.loadedTabs[tabName] = true;
            }

            scope.loadAuditTabContent = function () {

                if (!scope.auditAdditionalInfo) {

                    scope.auditAdditionalInfo = {

                        sortedColumn: 'TimeModified',

                        sortDirection: 'desc'
                    };
                }

                if (!scope.auditTabContent) {
                    scope.auditTabContent = "<div><w6-audit-grid object='object' strings='moduleStrings' \
                                                   additional-info='auditAdditionalInfo'></w6-audit-grid></div>";
                }
            };

            scope.resetAuditData = function () {

                scope.auditTabContent = undefined;

                $timeout(function () {

                    if (getActiveTab() == 'audit') {
                        scope.loadAuditTabContent();
                    }
                });
            };

            // functions used by the expressions in the panels that's contained inthe form
            //scope.convertDateToMoment = function (specificDate, type) {

            //    if (specificDate != undefined && specificDate != "1899-12-30T00:00:00") {

            //        var date = moment(specificDate);

            //        if (type) {
            //            date = resetHourMinutesSecond(type, date);
            //        }

            //        return date.format();
            //    }
            //};

            // functions used by the expressions in the panels that's contained inthe form
            scope.getKeyOfProp = function (value) {

                var collectionName = value.split(".")[0];
                var propName = value.split(".")[1];

                propName = propName.w6replaceAll('\\\\', "$?******?$");

                propName = propName.w6replaceAll('\\', '');

                propName = propName.w6replaceAll("$?******?$", '\\');

                return arrPropExpression[collectionName][propName];

            };


            scope.addToRelativeDate = function (i, type, time) {

                var date = moment();

                date.add(i, type);

                date = resetHourMinutesSecond(type, date);

                return date.format();
            };

            scope.openResolutionTabSelection = function (e) {
                scope.ShowSelectedTab = true;
                scope.selectedTab = e.target.innerHTML;
            }
            scope.closeResolutionTabSelection = function (e) {
                scope.ShowSelectedTab = false;
            }
            scope.showOthersTubsInList = function (e) {
                scope.showOthersTub = !scope.showOthersTub;
            }
            //#endregion

            //#region private functions

            var xml2json = function (xmlString) {

                var x2js = new X2JS();

                var jsonObject = x2js.xml_str2json(xmlString);

                return jsonObject;

            };

            var json2xml= function (jsonObject) {

                var x2js = new X2JS({ useDoubleQuotes: true });

                var xmlString = x2js.json2xml_str(jsonObject);

                return xmlString;
            }

            var initialize = function () {



                //w6analytics.track(scope.objectType + " Form Opened");

                setDefaultAttributesValues();

                setAPIObject();

                successGetFormSetting(data);

                //advancedFormSettingRequest = w6serverServices.getPlatformConfiguration({
                //    requestedProperties: "AdvancedFormSetting,ActionsPermissions",
                //    filter: "ObjectType eq '" + scope.platformConfigurationObjectType + "'"
                //});

                //getPropertiesInfo();

                var objectServicePromise = initializeObjectService();

                objectServicePromise.then(function () {
                    getFormObject();
                }, function () {
                    controller.apiObject.showUserMessage('error', scope.moduleStrings.UserMessagesInitializeServiceFail);
                    //controller.apiObject.showUserMessage('error', w6utils.stringFormat(scope.moduleStrings.UserMessagesInitializeServiceFail, [scope.objectService]));
                })

                registerPromisesCallback();

               



            }

            var initializeObjectService = function () {

                var promise = $q.defer();

                var filesArrayPromise;

                if (scope.objectService) {

                    if (scope.objectServiceFiles) {

                        var filesArray = scope.objectServiceFiles.split(',');

                        //filesArrayPromise = w6lazyLoader.load(filesArray);
                    }

                    $q.when(filesArrayPromise).then(function () {


                        objectService = $injector.get(scope.objectService);

                        if (objectService == null)
                            promise.reject();

                        if (!angular.isDefined(objectService.getObject)) {
                            w6log.error("Missing function definition 'getObject' in service " + scope.serverService);
                            promise.reject();
                        }

                        if (!angular.isDefined(objectService.updateObject)) {
                            w6log.error("Missing function definition 'updateObject' in service " + scope.serverService);
                            promise.reject();
                        }

                        promise.resolve();

                    }, function () {
                        promise.reject();
                    });

                }
                else {

                    //objectService = w6serverServices;

                    promise.resolve();
                }

                return promise.promise;
            }

            var setDefaultAttributesValues = function () {

                scope.advancedPlatformOptions = scope.advancedPlatformOptions || {};

                scope.platformConfigurationObjectType = scope.platformConfigurationObjectType || scope.objectType;

                if (!scope.moduleStrings) {

                    //getDefaultModuleString();
                }
            };

            var getDefaultModuleString = function () {

                var moduleStringsDefer = $q.defer();

                if (!scope.dependencies) {

                    scope.dependencies = [];
                }

                scope.dependencies.push(moduleStringsDefer);

                w6localization.getModuleStrings("platform").then(

                    function (data) {

                        if (data != null) {
                            scope.moduleStrings = data.data;
                        }

                        moduleStringsDefer.resolve("Loading platform moudle strings succeeded");
                    },

                    function (error) {

                        var errorMsg = 'Failed to load module strings.';

                        if (error.data.ExceptionMessage) {
                            errorMsg += " " + error.data.ExceptionMessage;
                        }

                        controller.apiObject.showUserMessage('error', errorMsg);

                        moduleStringsDefer.reject();
                    }
                );
            };

            var setAPIObject = function () {

                // apiObject is not supplied or - only name is supplied, object should be set on the direct parent's scope
                if (angular.isUndefined(scope.apiObject)) {

                    if (attributes.apiObject) {
                        scope.$parent[attributes.apiObject] = controller.apiObject;
                    }
                }

                // apiObject is supplied as object on one of the parents' scopes
                else if (angular.isObject(scope.apiObject)) {
                    scope.apiObject = controller.apiObject;
                }
            };

            var getIdentifierPropertyName = function () {

                var identifier;

                identifier = scope.actionPermissions.identifierPropertyName;

                if (identifier) {
                    identifierDefer.resolve(identifier);
                }
                else {
                    //w6schemeObjectsDictionaryCache.loadCollections();

                    //w6schemeObjectsDictionaryCache.array.$promise.then(function getIdentifier() {

                    //    var collections = w6schemeObjectsDictionaryCache.array;

                    //    if (collections != null) {

                    //        var result = collections.filter(function (propertyInfo) {
                    //            return propertyInfo.CollectionName == scope.objectType;
                    //        })[0];

                    //        if (result != null) {

                    //            if (result.CollectionType == "Dictionary") {
                    //                identifier = "Name";
                    //            }
                    //            else {

                    //                identifier = result.BusinessObjectTypeInfo.IdentifierPropertyName;
                    //            }

                    //            identifierDefer.resolve(identifier);
                    //        }

                    //        identifierDefer.reject('No property info found for ' + scope.objectType + ' collection');
                    //    }
                    //});
                }
            };

            var getFormObject = function () {


                //var inEditObjectResult;

                //if (angular.isFunction(scope.advancedPlatformOptions.getInEditObject)) {

                //    inEditObjectResult = scope.advancedPlatformOptions.getInEditObject(scope.objectKey, scope.objectType);
                //}

                //// in-edit object
                //if (inEditObjectResult != undefined) {

                //    result = {
                //        formObject: inEditObjectResult,
                //        formStateType: 'inEditObject'
                //    }

                //    deferredGetFormObject.resolve(result);
                //}

                //else {

                //    //this is existing object
                //    if (angular.lowercase(scope.objectKey) !== newObjectKey) {

                //        getExistingObject(scope.objectKey, 'edit');
                //    }

                //    else {

                //        //this is duplicate object
                //        if (scope.duplicateKey != undefined) {

                //            getExistingObject(scope.duplicateKey, 'duplicate');
                //        }

                //        //this is new object
                //        else {

                            result = {
                                formObject: undefined,
                                formStateType: "create"
                            }

                            deferredGetFormObject.resolve(result);
                    //    }
                    //}
                //}
            };

            var getExistingObject = function (objectKey, stateType) {

                var obj = objectService.getObject(scope.objectType, objectKey, true);

                obj.$promise.then(

                    function successGetFormEditObject(data) {

                        if (!data['@objectType']) {
                            data = null;
                        }
                        result = {
                            formObject: data,
                            formStateType: stateType
                        }

                        deferredGetFormObject.resolve(result);
                    },

                    function failedGetFormEditObject(error) {

                        controller.apiObject.showUserMessage('error', scope.moduleStrings.UserMessagesGetObjectFail);
                        //controller.apiObject.showUserMessage('error', w6utils.stringFormat(scope.moduleStrings.UserMessagesGetObjectFail, [scope.objectType, scope.objectKey]));

                        deferredGetFormObject.reject(error);
                    }
                );
            };

            var registerPromisesCallback = function () {

                //advancedFormSettingRequest.then(successGetFormSetting, failedGetFormSetting);

                //deferredGetFormObject.promise.then(formObjectInitializations);

                //var promises = [];

                //promises.push(advancedFormSettingRequest);

                //promises.push(identifierDefer.promise);

                //promises.push(deferredGetFormObject.promise);

                //promises.push(propertiesInfoPromise);

                //for (var dependency in scope.dependencies) {
                //    promises.push(scope.dependencies[dependency]);
                //}

                //$q.all(promises).then(successLoadFormDependencies, failedLoadFormDependencies);
            };

            var successGetFormSetting = function (data) {



                if (data[0] && data[0].AdvancedFormSetting != '') {

                    scope.actionPermissions = {};

                    if (data[0].ActionsPermissions) {

                        scope.actionPermissions = angular.fromJson(data[0].ActionsPermissions);

                    }


                    scope.actionPermissions.canUserDuplicateObject = scope.actionPermissions.canUserDuplicateObject != undefined ? scope.actionPermissions.canUserDuplicateObject : true;
                    scope.actionPermissions.canUserDeleteObject = scope.actionPermissions.canUserDeleteObject != undefined ? scope.actionPermissions.canUserDeleteObject : true;

                    scope.hasFormConfiguration = true;

                    advancedFormSetting = angular.fromJson(data[0].AdvancedFormSetting);

                    advancedFormSetting.htmlForm = setTabScroll(advancedFormSetting.htmlForm);

                    //  var formDataService = w6featureTogglingServices.resolveService('w6FormMultiLanguagesLocalization');

                    //scope.formExpressions = formDataService.getFormExpressions(advancedFormSetting.arrPropertiesExpression);

                    //scope.formExpressions.then(function (arrPropKeysExpression) {

                    //    arrPropExpression = arrPropKeysExpression;

                        // var formTemplateService = w6featureTogglingServices.resolveService('w6FormLocalization');

                        //scope.formTemplate = formTemplateService.getFormTemplate(advancedFormSetting.htmlForm, scope.objectType, advancedFormSetting.formHeader, data[0], scope.platformConfigurationObjectType);

                        //scope.formTemplate.then(function (formData) {

                        scope.formHeader = angular.isDefined(scope.advancedPlatformOptions.customFormCaption) ?
                            scope.advancedPlatformOptions.customFormCaption : advancedFormSetting.formHeader;

                        scope.metaData = advancedFormSetting.metaData;

                        for (var i = 0; i < scope.metaData.length; i++) {

                            scope.metaData[i].tabName = scope.metaData[i].tabName.replace("&amp;", "&");
                            scope.metaData[i].tabName = scope.metaData[i].tabName.replace("&lt;", "<");

                            scope.metaData[i].visable = scope.metaData[i].visable.replace("&amp;", "&");
                            scope.metaData[i].visable = scope.metaData[i].visable.replace("&lt;", "<");
                        }

                        addAuditTabToFormSettings();

                        // propertiesForAnalytics = advancedFormSetting.propertiesForAnalytics;

                        // propertiesForAnalyticsOnCreate = advancedFormSetting.propertiesForAnalyticsOnCreate;

                        //collectionID = parseInt(advancedFormSetting.objectType);

                        //refObjects = advancedFormSetting.refrencObject;

                        //getIdentifierPropertyName();

                        //w6pushNotificationService.register(collectionID, pushNotificationsForm);
                        //});
                    //});
                }

                else {

                    scope.hasFormConfiguration = false;

                    scope.formSetting = '<div id="unconfigureForm">' +
                        '<div class="gridCustomContent">' + scope.moduleStrings.FormNotConfiguredMessage + '</div>' +
                        '<div class="unconfigureFormButton">' +
                        '<button class="btn btn-default buttonCustomContent" ng-click="onCancelClick()">' + scope.moduleStrings.FormCancelButton + '</button>' +
                        '</div>' +
                        '</div>';
                }
            };

            var replaceSpecialCharInForm = function (html, regex, find, replace) {

                var reg = new RegExp(regex);

                var tempStrSource;
                var tempStrTarget;

                var result;

                while (result = reg.exec(html)) {

                    tempStrSource = result[0];
                    tempStrTarget = tempStrSource.replace(find, replace);
                    html = html.substr(0, result.index) + tempStrTarget + html.substr(result.index + tempStrSource.length);
                }

                return html;

            }

            var setTabScroll = function (htmlForm) {

                htmlForm = replaceSpecialCharInForm(htmlForm, "\{\{([^}]+\\\\[^\\\\a-zA-Z0-9][^}]+\|lowercase[^}]+)\}\}", "\\", "$?******?$");

                htmlForm = htmlForm.split("\\").join("$?******? $");

                htmlForm = replaceSpecialCharInForm(htmlForm, "\{\{([^}]+<[^}]+)\}\}", "<", "&lt;");// for date expression

                //Escaping the expressions so the parsing to JSON will work
                htmlForm = htmlForm.replace(/&&/g, '&amp;&amp;');
                htmlForm = htmlForm.replace(/<=/g, '&lt;=');

                htmlForm = replaceSpecialCharInForm(htmlForm, "&(?!(?:apos|quot|[gl]t|amp);|#|&)", "&", "&amp;"); // for &
                htmlForm = replaceSpecialCharInForm(htmlForm, "[^\>\}]<(?!(?:([\w]+)>([\w])+<\/\1>)|(\/\1))[^\/]", "<", "&lt;"); //for <

                var formSetting = xml2json(htmlForm);

                if (formSetting == null) {//error when parsing the html

                    w6log.error("There was an error when parsing the html, may be caused by a special character that included in the setting");

                    return htmlForm;
                }

                var originalFormSetting = angular.copy(formSetting);

                formSetting.div.div.div = [];

                delete formSetting.div.div.tabset;

                var addClass = "";

                if (!originalFormSetting.div.div.tabset.tab.length) {

                    addClass = 'oneTab'
                }

                formSetting.div.div.div.push({
                    "_class": "{{isAuditDefined != true ? '" + addClass + "' : ''}}",
                    "_scrolling-tabs-wrapper": "",
                    "tabset": originalFormSetting.div.div.tabset
                });

                formSetting.div.div.div.push(originalFormSetting.div.div.div);

                htmlForm = json2xml(formSetting);

                htmlForm = htmlForm.split("$?******? $").join("\\");

                return htmlForm;

            }

            var failedGetFormSetting = function (error) {

                var errorMsg = scope.moduleStrings.UserMessagesSaveObjectFail;

                if (error.data.ExceptionMessage) {
                    errorMsg += " " + error.data.ExceptionMessage;
                }

                controller.apiObject.showUserMessage('error', errorMsg);
            };

            var formObjectInitializations = function (formObjectResponse) {

                switch (formObjectResponse.formStateType) {

                    case "edit":

                        scope.object = formObjectResponse.formObject;

                        scope.originalObject = angular.copy(scope.object);

                        scope.formState = "edit";

                        break;

                    case "duplicate":

                        scope.object = formObjectResponse.formObject;

                        scope.originalObject = angular.copy(scope.object);

                        scope.formState = "duplicate";

                        scope.object.Key = newObjectKey;

                        delete scope.object.Revision;

                        scope.form.$setDirty();

                        break;

                    case "create":

                        scope.object["@objectType"] = scope.objectType;

                        scope.formState = "create";

                        scope.object.Key = newObjectKey;

                        scope.form.$setDirty();

                        break;

                    case "inEditObject":

                        //load edited object and it's changedProperties
                        scope.object = formObjectResponse.formObject.objectInEdit;

                        scope.formState = "in-edit";

                        scope.changedObject = formObjectResponse.formObject.changedProperties;

                        scope.originalObject = formObjectResponse.formObject.originalObject;

                        if (angular.isDefined(formObjectResponse.formObject.customPanelsData)) {
                            scope.customPanelsData = formObjectResponse.formObject.customPanelsData;
                        }

                        //set dirty when object is new or when object has been changed
                        if (scope.object.Key === newObjectKey || scope.changedObject.Key != undefined) {
                            scope.form.$setDirty();
                        }

                        break;
                }
            };

            var successLoadFormDependencies = function (data) {

                /*
                * data[0] - advanced Form Setting
                * data[1] - object identifier property
                * data[2] - Form Object {formStateType: "",formObject: {}}
                */

                // set the object identifier property name
                objectIdentifier = data[1];

                if (data[2].formObject !== null) {

                    if (advancedFormSetting) {

                        scope.isAuditDefined = false;

                        if (scope.hideAuditTab) {
                            addAuditTabToFormSettings();
                        }

                        else {

                            //    var hasAuditRequest = w6AuditService.isAuditDefined(scope.objectType);

                            //    hasAuditRequest.$promise.then(function (data) {

                            //        scope.isAuditDefined = data._Status;

                            //        addAuditTabToFormSettings()
                            //    });
                            //}

                            //getReferencedObjects();

                        }
                    }
                    else {

                        showObjectDoesNotExistMessage();
                    }

                    scope.raiseObjectInitializedEvent(data[2]);

                    setActiveTabOnFormLoad();
                };
            }

            var failedLoadFormDependencies = function (error) {
                var errorText = scope.moduleStrings.UserMessagesFormLoadFail;
                //var errorText = w6utils.stringFormat(scope.moduleStrings.UserMessagesFormLoadFail, [scope.objectType]);
                controller.apiObject.showUserMessage('error', errorText + ' ' + error);
            };

            var addAuditTabToFormSettings = function () {

                var auditTab = buildAuditTab();

                var index = advancedFormSetting.htmlForm.indexOf("</tabset>");

                var string = advancedFormSetting.htmlForm.substring(0, index);

                string += auditTab;

                string += advancedFormSetting.htmlForm.substring(index);

                scope.formSetting = string;
            };

            var buildAuditTab = function () {

                scope.metaData.push({
                    tabName: 'audit',
                    properties: [],
                    visable: true,
                    active: false
                });

                return tab = "<tab heading=\"{{::moduleStrings.History}}\" ng-click=\"loadAuditTabContent()\" \
                                   ng-show=\"object.Key!='new' && object.Key!=-1 && object.Stamp && isAuditDefined\" active=\"metaData[metaData.length - 1].active\"> \
                                  <ng-form ng-if=\"object.Key!='new' && object.Key!=-1 && object.Stamp && isAuditDefined\" name=\"Audit\"> \
                                       <div html-compile=\"auditTabContent\" should-keep-watch=\"true\"></div> \
                                  </ng-form> \
                              </tab>"
            };

            scope.raiseObjectInitializedEvent = function (formObject) {

                if (formObject) {
                    scope.isDuplicate = scope.formState == 'duplicate' || scope.formState == 'in-edit' && formObject.formObject.isDuplicateObject == 'true';
                }

                /*Documentation: We documented this event for Bold.GA. We hid it for Bold.MR02 because custom panels cannot listen to the event (the reason is explained in the documentation). Effectively, the event is only emitted because there is no child scope that can listen to the broadcast.*/
                /*
                 * @ngdoc event
                 * @name form:onObjectInitialized
                 * @eventOf platformModule.object:w6Form
                 * @description Dispatched to the parent and child scopes after the form retrieves the business object or dictionary item that it displays.
                 *
                 * Note: A custom panel cannot listen to this event because the event fires before the custom panel is loaded.
                 * @param {object} object A reference to the object that is displayed on the form, in {@link basicInfo.overview:JSON%20Representation%20of%20Business%20Objects JSON} representation. If the user edits the properties on the form, the property values of the object parameter change.
                 * @param {string} objectIdentifier The property name of the object identifier that is defined in the Schema Editor. For example, if the object is a dictionary item, the objectIdentifier is "Name".
                 * @param {object} changedObject This parameter keeps track of the properties displayed on the form that differ from the ones saved in the database. When the form is initialized, changedObject is empty. If the user or the code changes a property, it is added to changedObject with a value of true (meaning that the user changed the value) or false (meaning that the code changed the value). 
                 *	
                 * For example, if the user edits the Priority property on the form, changedObject.Priority = true. If the code changes the Priority property, changedObject.Priority = false.
                 *				 
                 * The behavior described here is for regular property controls that appear on the form. If a custom panel changes a property value, it might need to edit changedObject in a different way. For details, consult with ClickSoftware Worldwide Support.
                 * @param {boolean} isDuplicate True if the user created the object by running the Duplicate command on another object.
                 * @param {object} customPanelsData This parameter is for internal use only.
                 */
                scope.$emit('form:onObjectInitialized', scope.object, objectIdentifier, scope.changedObject, scope.isDuplicate, scope.customPanelsData);
                scope.$broadcast('form:onObjectInitialized', scope.object, objectIdentifier, scope.changedObject, scope.isDuplicate, scope.customPanelsData);
            };

            var setActiveTabOnFormLoad = function () {

                var localState = scope.getLocalState({ formObjectType: scope.objectType, formObjectKey: scope.objectKey });

                if (localState && localState.activeTab) {

                    var setActiveTabSucceeded = setActiveTab(localState.activeTab);

                    if (!setActiveTabSucceeded) {
                        loadFirstVisibleTab();
                    }
                }

                else {
                    loadFirstVisibleTab();
                }
            };

            var getReferencedObjects = function (ref) {

                if (ref == undefined) {
                    ref = refObjects;
                }

                for (var i = 0; i < ref.length; i++) {

                    (function (i) {

                        if (scope.object[ref[i].propertyName] != undefined && scope.object[ref[i].propertyName].Key != -1) {

                            var refObjKey = scope.object[ref[i].propertyName].Key;

                            if (refObjKey != -1) {

                                var obj = getReferencedObjectPromise(ref[i].objectType, refObjKey);

                                obj.$promise.then(

                                    function successGetReferencedObjects(data) {

                                        if (scope.object[ref[i].propertyName] != undefined) {

                                            scope.referencedObjects[ref[i].propertyName] = undefined;

                                            scope.referencedObjects[ref[i].propertyName] = data;
                                        }
                                    },

                                    function failedGetReferencedObjects(error) {

                                        var errorText = scope.moduleStrings.UserMessagesGetObjectFail;
                                        //var errorText = w6utils.stringFormat(scope.moduleStrings.UserMessagesGetObjectFail, [ref[i].objectType, refObjKey]);

                                        if (error.data.ExceptionMessage) {
                                            errorText += error.data.ExceptionMessage;
                                        }

                                        controller.apiObject.showUserMessage('error', errorText);
                                    }
                                )
                            }
                        }
                        else {
                            if (scope.referencedObjects[ref[i].propertyName]) {
                                scope.referencedObjects[ref[i].propertyName] = undefined;
                            }
                        }
                    })(i);
                }
            };

            var pushNotificationsForm = function (data) {

                w6log.info(data);

                var objectKeyUpdate = $filter('filter')(data.UpdatedObjects, { 'ObjectKey': scope.object["Key"] });

                if (objectKeyUpdate.length > 0) {
                    updateObject(objectKeyUpdate);

                }
                else {
                    var objectKeyDelete = $filter('filter')(data.DeletedObjects, { 'ObjectKey': scope.object["Key"] });
                    if (objectKeyDelete.length > 0) {
                        deleteObject();
                    }
                }

            }

            var updateObject = function (objectKeyUpdate) {

                if (!scope.form.$dirty) {
                    updateObjectNotInEdit(objectKeyUpdate);
                }
                else {
                    updateObjectInEdit(objectKeyUpdate);
                }
            }

            var updateObjectNotInEdit = function (objectKeyUpdate) {
                setUpdateChanges(objectKeyUpdate[0].ModifiedProperties + ',Revision');
            }

            var updateObjectInEdit = function (objectKeyUpdate) {
                var numOfSameChange = 0;
                var changedProperties = objectKeyUpdate[0].ModifiedProperties.split(',');

                var requestedProperties = 'Revision,Stamp,';


                for (var i = 0; i < changedProperties.length; i++) {

                    requestedProperties += changedProperties[i] + ',';

                    if (scope.changedObject[changedProperties[i]]) {
                        numOfSameChange++;
                    }
                }
                if (numOfSameChange === changedProperties.length)
                    return;


                requestedProperties.slice(0, -1);
                setUpdateChanges(requestedProperties, numOfSameChange);
            }

            var setUpdateChanges = function (requestedProperties, numOfSameChange) {

                var getUpdatedObject = objectService.getObjects(scope.objectType, {

                    filter: "Key eq " + scope.objectKey,
                    requestedProperties: requestedProperties

                });

                getUpdatedObject.$promise.then(function (data) {
                    if (data) {

                        var updateProperties = requestedProperties.split(',');
                        for (var i = 0; i < updateProperties.length; i++) {
                            if (scope.changedObject[updateProperties[i]] === undefined) {
                                if (updateProperties[i] != "Revision") {

                                    scope.object[updateProperties[i]] = data[0][updateProperties[i]];

                                }
                                else {
                                    if (numOfSameChange === 0 || numOfSameChange === undefined)
                                        scope.object[updateProperties[i]] = data[0][updateProperties[i]];
                                }
                            }
                        }
                    }
                });
            };

            var deleteObject = function () {
                w6log.info('This object has been deleted by another user');
            };



            var loadFirstVisibleTab = function () {

                setActiveTab();
            };


            var setActiveTab = function (tabName) {

                for (var i = 0; i < scope.metaData.length; i++) {

                    // if tab name is undefined (means - first tab) or if this is the requested tab
                    if ((!tabName || scope.metaData[i].tabName == tabName) &&

                        // only if the tab is visible
                        scope.$eval(scope.metaData[i].visable) == true) {

                        scope.metaData[i].active = true;

                        scope.enterTab(tabName ? tabName : scope.metaData[i].tabName);

                        return true;
                    }
                }
            };

            var getActiveTab = function () {
                for (var i = 0; i < scope.metaData.length; i++) {
                    if (scope.metaData[i].active == true) {
                        return scope.metaData[i].tabName;
                    }
                }
                return;
            };

            var promptOnChangeLocation = function (event) {

                var requestedPath = $location.path();

                if (scope.hasFormConfiguration && scope.form.$dirty) {

                    event.preventDefault();

                    scope.advancedPlatformOptions.requestedPath = requestedPath;

                    showObjectsInEditMessage(event);
                }

                else {

                    if (angular.isFunction(scope.advancedPlatformOptions.checkOtherFormsInEdit)) {

                        var hasFormsInEdit = scope.advancedPlatformOptions.checkOtherFormsInEdit();

                        if (hasFormsInEdit) {

                            event.preventDefault();

                            scope.advancedPlatformOptions.requestedPath = requestedPath;
                        }
                    }
                }
            };

            var showObjectsInEditMessage = function (event) {

                var options = getPromptOptions()

                //w6dialogService.question({

                //    title: options.title,
                //    body: options.message,
                //    buttons: [
                //        {
                //            kind: 'primary',
                //            label: options.buttons[0].label,
                //            action: function () {
                //                saveEditedObjects();
                //            }
                //        },
                //        {
                //            label: options.buttons[1].label,
                //            action: function () {
                //                scope.$emit('form:onCancelClicked');
                //                scope.$broadcast('form:onCancelClicked');
                //                checkOtherForms();
                //            }
                //        },
                //        {
                //            label: options.buttons[2].label,
                //            action: function () {
                //                scope.advancedPlatformOptions.requestedPath = null;
                //            }
                //        }]
                //});


            };

            var showObjectDoesNotExistMessage = function (event) {

                //w6dialogService.error({

                //    title: scope.moduleStrings.UserMessagesErrorTitle,
                //    body: scope.moduleStrings.UserMessagesTryOpenNotExistObject,
                //    buttons: [
                //        {
                //            kind: 'primary',
                //            label: scope.moduleStrings.UserMessagesOKButton,
                //            action: function () {
                //                scope.onCancelClick();
                //            }
                //        }]
                //});
            };

            var getPromptOptions = function () {

                //build save forms message
                var messageStr = '';

                if (scope.object.Key == newObjectKey) {

                    if (scope.duplicateKey) {
                        messageStr = scope.moduleStrings.SaveDuplicatedFormMessage;
                    }

                    else {
                        messageStr = scope.moduleStrings.SaveNewFormMessage;
                    }
                }

                else {
                    var displayIdentifier = scope.object[objectIdentifier]
                           /* || w6keyRefrenceService.getDisplayKey(scope.object.Key)*/;

                    messageStr = scope.moduleStrings.SaveFormMessage
                    //messageStr = w6utils.stringFormat(scope.moduleStrings.SaveFormMessage, [displayIdentifier])
                }

                var options = {

                    title: scope.moduleStrings.SaveFormMessageHeader,

                    message: messageStr,

                    "buttons": [

                        //yes option - get the result with primary true
                        {
                            "label": scope.moduleStrings.SaveButton,
                            "cancel": false,
                            "primary": true
                        },
                        //no option - get the result with primary false
                        {
                            "label": scope.moduleStrings.DoNotSaveButton,
                            "cancel": false,
                            "primary": false
                        },
                        //cancel button will cancel the action
                        {
                            "label": scope.moduleStrings.CancelButton,
                            "cancel": true,
                            "primary": false
                        }
                    ]
                };
                return options;
            };

            var saveEditedObjects = function () {

                $q.all(getPromises(scope.beforeOKClickFunctions)).then(function () {

                    $timeout(function () {

                        var savingResult = saveForm();

                        if (savingResult) {

                            savingResult.then(

                                function success(updatedObject) {

                                  //  unRegisterLocationChangeEvent();

                                    //DEPRECATED - remains only for backward compatibility
                                    scope.$broadcast('onObjectSaved');

                                    scope.$emit('form:onOKClicked', []);

                                    scope.$broadcast('form:onOKClicked', []);

                                    checkOtherForms();
                                },

                                function failure(error) {

                                    var errorMsg = scope.moduleStrings.UserMessagesSaveObjectFail;

                                    if (error.data.ExceptionMessage) {
                                        errorMsg += ' ' + error.data.ExceptionMessage;
                                    }

                                    controller.apiObject.showUserMessage('error', errorMsg);
                                });
                        }
                    });
                });
            };

            var checkOtherForms = function () {

                var hasFormsInEdit;

                if (angular.isFunction(scope.advancedPlatformOptions.checkOtherFormsInEdit)) {

                    hasFormsInEdit = scope.advancedPlatformOptions.checkOtherFormsInEdit();
                }

                if (!hasFormsInEdit) {

                    //unRegisterLocationChangeEvent();

                    $location.path(scope.advancedPlatformOptions.requestedPath);

                    scope.advancedPlatformOptions.requestedPath = null;
                }
            };

            var saveForm = function () {

                var invalidTab = getInvalidTab();

                if (invalidTab != undefined) {

                    setActiveInvalidTab(invalidTab);

                    $timeout(function () {

                        //DEPRECATED - remains only for backward compatibility
                        scope.$broadcast('formSubmitted', { formSubmitted: true });

                        /*Documentation: In Bold.MR02, this event has a parameter:
                        @param {object} submitData An object having a formSubmitted property, whose value is true. 
                        Chani asked me not to document the parameter. She plans to remove it from the code.*/
                        /**
                         * @ngdoc event
                         * @name form:onSubmitted
                         * @eventOf platformModule.object:w6Form
                         * @description Dispatched to both parent and child scopes when the user submits the form to the server, before the form displays any validation errors that it might have detected, and before the object is saved in the database.
                         */
                        scope.$emit('form:onSubmitted', { formSubmitted: true });

                        scope.$broadcast('form:onSubmitted', { formSubmitted: true });
                    });

                    scope.advancedPlatformOptions.requestedPath = null;
                }


                else {
                    var tenantName = w6studioSettings.tenantInfo.OUName;
                    //edit
                    if (!(scope.object.Key == newObjectKey))
                        return saveObject();

                    IsUserExist(scope.object.UserPrincipalName, tenantName).then(function (data) {
                        if (!data) {
                            scope.object.Key = -1;
                            return saveObject();
                        }
                        else {
                            //w6dialogService.error({
                            //    title: "",
                            //    body: "The user name you entered already exists"
                            //});

                        }

                    });
                }



            };

            //var IsUserExist = function (userName, tenantName) {

            //    var deffered = $q.defer();

            //    var IsUserExistRes = w6serverServices.getObjects('SOUser',
            //        {
            //            filter: "UserPrincipalName eq '" + userName + "@" + tenantName + "'",
            //            requestedProperties: "Key"
            //        });

            //    IsUserExistRes.$promise.then(
            //        function (data) {

            //            deffered.resolve(data[0]);
            //        },
            //        function (reason) {
            //            deffered.reject(reason);
            //        });
            //    return deffered.promise;
            //}


            var getInvalidTab = function () {

                //if only one tab was configured + the audit tab
                if (scope.metaData.length == 2) {
                    if (scope.form.$invalid)
                        return scope.metaData[0];
                }
                else {

                    for (var i = 0; i < scope.metaData.length; i++) {

                        if (scope.form[scope.metaData[i].tabName]) {

                            if (scope.$eval(scope.metaData[i].visable) && scope.form[scope.metaData[i].tabName].$invalid) {

                                return scope.metaData[i];
                            }
                        }

                        //in case of tab is still unloaded
                        else {

                            if (scope.$eval(scope.metaData[i].visable)) {

                                for (var j = 0; j < scope.metaData[i].properties.length; j++) {

                                    var property = scope.metaData[i].properties[j];

                                    var result;

                                    if (shouldCheckPropertyValidation(property)) {

                                        //do validation
                                        result = isInvalidProperty(property);

                                    }

                                    if (result == false && isMultiValue(property)) {

                                        result = IsInvalidMVCulomns(property);
                                    }

                                    if (result == true) return scope.metaData[i];

                                }

                            }

                        }

                    }

                }
            };

            var shouldCheckPropertyValidation = function (property) {

                var mandatory = scope.$eval(property.mandatory);

                var readOnly = scope.$eval(property.readOnly);

                var visable = scope.$eval(property.visable);

                return mandatory && !readOnly && visable;

            }

            var isMultiValue = function (prop) {

                return prop.mandatoryCulomns != undefined;
            }

            var IsInvalidMVCulomns = function (MVprop) {

                if (MVprop.mandatoryCulomns && MVprop.mandatoryCulomns.length) {

                    var value = scope.object[MVprop.propertyName];

                    if (!value) {
                        return false;
                    }

                    for (var i = 0; i < value.length; i++) {

                        for (var j = 0; j < MVprop.mandatoryCulomns.length; j++) {

                            if (value[i][MVprop.mandatoryCulomns[j]] == "" ||
                                value[i][MVprop.mandatoryCulomns[j]] == undefined ||
                                value[i][MVprop.mandatoryCulomns[j]].Key == -1) return true;

                        }
                    }
                }

                return false;
            }

            var isInvalidProperty = function (prop) {

                var type = $filter('filter')(propertiesInfo, { PropertyName: prop.propertyName })[0].PropertyType;

                var value = scope.object[prop.propertyName];

                switch (type) {

                    case "String":

                        return !value

                    case "Duration":

                    case "Long":

                    case "Double":

                        return value == undefined || value == 0;

                    case "Key":

                        return value == null || value.Key == null || value.Key === -1;

                    case "Date":

                        return value == null || value == "1899-12-30T00:00:00";

                    case "MultiValue":

                        return value == undefined || value.length == 0;


                }


            }

            var getPropertiesInfo = function () {

                propertiesInfoPromise = w6schemaServices.getPropertiesInfo(scope.objectType, true).$promise;

                propertiesInfoPromise.then(function (data) {

                    propertiesInfo = data;
                });

                return propertiesInfoPromise;
            }

            var setActiveInvalidTab = function (tab) {


                scope.enterTab(tab.tabName);

                tab.active = true;

            };
            var saveObject = function () {

                var deferred = $q.defer();

                if (scope.isRequestInProgress == false) {

                    scope.isRequestInProgress = true;

                    $q.all(getPromises(scope.beforeObjectSavedFunctions)).then(

                        function beforeObjectSavedSuccess() {

                            checkNonVisableProperties();

                            if (scope.object.Key === -1) {
                                scope.changedObject = angular.copy(scope.object);
                                writePropertiesForAnalyticsOnCreate();
                            }
                            else {
                                writeChangedPropertiesForAnalytics();
                            }

                            if (!angular.equals(scope.changedObject, {}) || controller.apiObject.customSaveProcess != null) {

                                if (!angular.equals(scope.changedObject, {})) {
                                    scope.changedObject.Revision = scope.object.Revision;
                                }

                                var saveFunction = getSaveFunction();
                                var result = saveFunction(scope.objectType, scope.changedObject, true);

                                result.then(

                                    function successUpdateObject(updatedObject) {

                                        if (updatedObject == null) {
                                            scope.isRequestInProgress = false;
                                            deferred.resolve(scope.object);
                                        }

                                        else if (scope.object.Key === -1) {

                                            if (scope.advancedPlatformOptions.childObjects &&
                                                scope.advancedPlatformOptions.childObjects.length !== 0) {

                                                scope.advancedPlatformOptions.childObjects[scope.advancedPlatformOptions.childObjects.length - 1].newObject = updatedObject;
                                            }
                                        }

                                        scope.object = updatedObject;

                                        deferred.resolve(updatedObject);
                                        $timeout(function () {
                                            scope.isRequestInProgress = false;
                                        });
                                    },

                                    function failedUpdateObject(errorData) {
                                        scope.isRequestInProgress = false;
                                        deferred.reject(errorData);
                                    }
                                );

                            }
                            else {
                                scope.isRequestInProgress = false;
                                deferred.resolve(scope.object);
                            }

                        },

                        function beforeObjectSavedFailure() {

                            scope.isRequestInProgress = false;

                        });
                }

                return deferred.promise;
            };

            var getPromises = function (functionsArray) {

                var promises = [];

                for (var i = 0; i < functionsArray.length; i++) {

                    var promise = $q.when(functionsArray[i]())

                    promises.push(promise);
                }
                return promises;
            };

            var checkNonVisableProperties = function () {

                var changesProperties = [];
                var deletedProperties = [];

                for (var t = 0; t < scope.metaData.length; t++) {

                    var isVisableTab = scope.$eval(scope.metaData[t].visable);

                    for (var i = 0; i < scope.metaData[t].properties.length; i++) {

                        var propName = scope.metaData[t].properties[i].propertyName;

                        var isPropChangeFromUser = scope.changedObject[propName];

                        if (isPropChangeFromUser != undefined) {
                            if (isPropChangeFromUser == true) {

                                var isVisableProperty = scope.$eval(scope.metaData[t].properties[i].visable);
                                var isReadOnlyProperty = scope.$eval(scope.metaData[t].properties[i].readOnly);

                                if (isVisableProperty && isVisableTab && !isReadOnlyProperty) {
                                    changesProperties.push(propName);
                                }
                                else {

                                    deletedProperties.push(propName);
                                }
                            }
                            else {
                                scope.changedObject[propName] = scope.object[propName];
                            }
                        }
                    }
                }

                if (deletedProperties.length > 0) {
                    for (var i = 0; i < deletedProperties.length; i++) {
                        if (changesProperties.indexOf(deletedProperties[i]) == -1) {
                            delete scope.changedObject[deletedProperties[i]];
                        }
                    }
                }

                for (var key in scope.changedObject) {
                    if (scope.changedObject[key] == true || scope.changedObject[key] == false) {
                        scope.changedObject[key] = scope.object[key];
                    }
                }
            };

            //var writeChangedPropertiesForAnalytics = function () {

            //    if (!propertiesForAnalytics) return;

            //    var propertiesForAnalyticsArray = propertiesForAnalytics.split(",");
            //    for (var i = 0; i < propertiesForAnalyticsArray.length; i++) {
            //        if (angular.isDefined(scope.changedObject[propertiesForAnalyticsArray[i]]))
            //            //w6analytics.track(propertiesForAnalyticsArray[i] + " property of the " + scope.objectType + " object is changed");
            //    }
            //};

            //var writePropertiesForAnalyticsOnCreate = function () {

            //    if (!propertiesForAnalyticsOnCreate) return;

            //    var propertiesForAnalyticsArray = propertiesForAnalyticsOnCreate.split(",");
            //    for (var i = 0; i < propertiesForAnalyticsArray.length; i++) {
            //        if (scope.changedObject[propertiesForAnalyticsArray[i]].Key && scope.changedObject[propertiesForAnalyticsArray[i]].Key != -1)
            //            //w6analytics.track(propertiesForAnalyticsArray[i] + " property of the " + scope.objectType + " object is changed");
            //    }

            //};

            var getSaveFunction = function () {



                if (controller.apiObject.customSaveProcess == null) {

                    return function (objectType, changedObject, errorHandled) {

                        return objectService.updateObject(objectType, changedObject, errorHandled).$promise;
                    };
                }
                else {

                    return controller.apiObject.customSaveProcess;
                }

            };

            var resetHourMinutesSecond = function (type, date) {

                switch (type) {

                    case 'day':
                        date.set('hour', 0);
                        date.set('minutes', 0);
                        date.set('second', 0);
                        break;
                    case 'hour':
                        date.set('minutes', 0);
                        date.set('second', 0);
                        break;
                    case 'minutes':
                        date.set('second', 0);
                        break;
                }

                return date;
            };

            //var getReferencedObjectPromise = function (objectType, refObjKey) {

            //    if (scope.objectService) {

            //        if (angular.isDefined(objectService.getReferencedObject))
            //            return objectService.getReferencedObject(objectType, refObjKey, true)
            //    }

            //    return w6serverServices.getObject(objectType, refObjKey, true);
            //}
            //};
            //#endregion

            initialize();

        }

        w6Form.controller = ['$scope', '$element', function ($scope, $element) {

            var controller = this;

            var initializeFormAPI = function () {

                if (angular.isObject($scope.apiObject)) {
                    controller.apiObject = $scope.apiObject;
                }

                else {
                    controller.apiObject = {};
                }

                var beforeObjectSavedFunctions = [];

                // functions

                /**
                 * @ngdoc method
                 * @name showUserMessage
                 * @methodOf platformModule.object:w6Form
                 * @description Displays a message string near the top of the form, for example, "Initialize succeeded" or "Validation error".
                 * @param {string} type The message type: "success", "error", "warning", or "info".
                 * @param {string} message The message text to display.			 
                 */
                controller.apiObject.showUserMessage = showUserMessage;

                /**
                 * @ngdoc method
                 * @name setVisibilityOfProperty
                 * @methodOf platformModule.object:w6Form
                 * @description Sets whether a property control is visible or hidden. For example, a custom panel might call this method to hide a property, depending on the value of another property.
                 *
                 * The method affects only the property controls that belong directly to the w6Form object. It does not affect property controls that are displayed by custom panels.
                 * @param {string} propertyName The name of the property.
                 * @param {boolean} isVisible True to show the property, or false to hide it.						 
                 */
                controller.apiObject.setVisibilityOfProperty = setVisibilityOfProperty;

                /**
                 * @ngdoc method
                 * @name setVisibilityOfTab
                 * @methodOf platformModule.object:w6Form
                 * @description Sets whether a form tab is visible or hidden. For example, a custom panel might call this method to hide a tab, depending on the value of a property.
                 * @param {string} tabName The name of the tab.
                 * @param {boolean} isVisible True to show the tab, or false to hide it.						 
                 */
                controller.apiObject.setVisibilityOfTab = setVisibilityOfTab;

                /**
                 * @ngdoc method
                 * @name setOKText
                 * @methodOf platformModule.object:w6Form
                 * @description Sets the label on the OK button of the form. The default label is "OK".
                 * @param {string} text The label to display.			
                 */
                controller.apiObject.setOKText = setOKText;

                /**
                 * @ngdoc method
                 * @name setApplyText
                 * @methodOf platformModule.object:w6Form
                 * @description Sets the label on the Apply button of the form. The default label is "Apply".
                 * @param {string} text The label to display.			
                 */
                controller.apiObject.setApplyText = setApplyText;

                /**
                 * @ngdoc method
                 * @name setCancelText
                 * @methodOf platformModule.object:w6Form
                 * @description Sets the label on the Cancel button of the form. The default label is "Cancel".
                 * @param {string} text The label to display.				
                 */
                controller.apiObject.setCancelText = setCancelText;

                /**
                 * @ngdoc method
                 * @name refreshAuditData
                 * @methodOf platformModule.object:w6Form
                 * @description Refreshes the audit trail data on the History tab of a form, by loading the data from the server.
                 */
                controller.apiObject.refreshAuditData = refreshAuditData;

                /**
                 * @ngdoc method
                 * @name getCustomPanelData
                 * @methodOf platformModule.object:w6Form
                 * @description Each custom panel has a data object where it can store any desired information. This method retrieves the object. The custom panel can read or write data that is stored within the object.
                 *
                 * For example, if the user displays a secondary form, and then returns to the main form, the custom panel can use this method to recover data that it stored.
                 *
                 * The method can retrieve the data of any custom panel in the form. Therefore, you can use the method to share data between different custom panels.
                 * @param {integer} customPanelId The ID number of the custom panel.
                 * @returns {object} The data stored by the custom panel. The data can have any internal structure.
                 */
                controller.apiObject.getCustomPanelData = getCustomPanelData;

                /*Documentation: Not documented for Bold.MR02 */
                controller.apiObject.getAllCustomPanelsData = getAllCustomPanelsData;

                /*Documentation: Not documented for Bold.MR02 */
                controller.apiObject.customSaveProcess = null;



                // properties
                Object.defineProperties(controller.apiObject, {

                    /**
                     * @ngdoc method
                     * @name beforeObjectSaved
                     * @methodOf platformModule.object:w6Form
                     * @description A user-implemented method that runs before the form saves the object, for example, when the user clicks the OK or Apply button, or when the user clicks Save in a "Do you want to save?" prompt.
                     *
                     * A custom panel can implement this method. When the user clicks OK, Apply, or Save, the form runs the method.
                     * @returns {promise|any type} If the method returns a promise that is resolved, or if the method returns any other data type, the form saves the object. If the method returns a promise that is rejected, the form cancels the save.
                     */
                    'beforeObjectSaved': {
                        set: function (value) { $scope.beforeObjectSavedFunctions.push(value); },
                        enumerable: true,
                        configurable: true
                    },

                    /**
                    * @ngdoc method
                    * @name beforeOKClick
                    * @methodOf platformModule.object:w6Form
                    * @description A user-implemented method that runs when the user clicks the OK button, before the form runs the OK operation such as saving the object, and before the system closes the form.
                    *
                    * A custom panel can implement this method. When the user clicks OK, the form runs the method.
                    * @returns {promise|any type} If the method returns a promise that is resolved, or if the method returns any other data type, the form runs the OK operation. If the method returns a promise that is rejected, the form cancels the OK operation, and the form remains open.			
                    */
                    'beforeOKClick': {
                        set: function (value) { $scope.beforeOKClickFunctions.push(value); },
                        enumerable: true,
                        configurable: true
                    },

                    /**
                    * @ngdoc method
                    * @name beforeApplyClick
                    * @methodOf platformModule.object:w6Form
                    * @description  A user-implemented method that runs when the user clicks the Apply button, before the form runs the Apply operation such as saving the object.
                    *
                    * A custom panel can implement this method. When the user clicks Apply, the form runs the method.
                    * @returns {promise|any type} If the method returns a promise that is resolved, or if the method returns any other data type, the form runs the Apply operation. If the method returns a promise that is rejected, the form cancels the Apply operation.			
                    */
                    'beforeApplyClick': {
                        set: function (value) { $scope.beforeApplyClickFunctions.push(value); },
                        enumerable: true,
                        configurable: true
                    },

                    /**
                     * @ngdoc property
                     * @name isDuplicate
                     * @propertyOf platformModule.object:w6Form
                     * @description (Read-only) Indicates whether the object displayed on the form was created by running the Duplicate command on another object.
                     *
                     * When the user saves the object, the server changes the Key and it ceases to be a duplicate.
                     * @returns {boolean} True if the object is a duplicate.
                     */
                    'isDuplicate': {
                        get: function () { return $scope.isDuplicate; },
                        enumerable: true,
                        configurable: true
                    },

                    /**
                     * @ngdoc property
                     * @name object
                     * @propertyOf platformModule.object:w6Form
                     * @description (Read/write) The business object or dictionary item that is displayed on the form, including the current values of the property controls.
                     * @returns {object} A {@link basicInfo.overview:JSON%20Representation%20of%20Business%20Objects JSON} representation of the object.
                     */
                    'object': {
                        get: function () { return $scope.object; },
                        set: function (value) {

                            $scope.object = value;

                            $scope.raiseObjectInitializedEvent();
                        },
                        enumerable: true,
                        configurable: true
                    },

                    /**
                     * @ngdoc property
                     * @name originalObject
                     * @propertyOf platformModule.object:w6Form
                     * @description (Read-only) The original business object or dictionary item that the form opened, including its unedited property values.
                     * @returns {object} A {@link basicInfo.overview:JSON%20Representation%20of%20Business%20Objects JSON} representation of the object.
                     */
                    'originalObject': {
                        get: function () { return $scope.originalObject; },
                        enumerable: true,
                        configurable: true
                    },

                    /**
                     * @ngdoc property
                     * @name hasFormConfiguration
                     * @propertyOf platformModule.object:w6Form
                     * @description (Read-only) Indicates whether a form has been configured for the object type that is specified in the w6Form object.
                     * @returns {boolean} True if the object type has a form configuration.
                     */
                    'hasFormConfiguration': {
                        get: function () { return $scope.hasFormConfiguration; },
                        enumerable: true,
                        configurable: true
                    },

                    /**
                     * @ngdoc property
                     * @name formHeader
                     * @propertyOf platformModule.object:w6Form
                     * @description (Read/write) The title of the form.
                     * @returns {string} The title text.
                     */
                    'formHeader': {
                        get: function () { return $scope.formHeader; },
                        set: function (value) { $scope.formHeader = value; },
                        enumerable: true,
                        configurable: true
                    },

                    /**
                     * @ngdoc property
                     * @name actionPermissions
                     * @propertyOf platformModule.object:w6Form
                     * @description (Read-only) Indicates the permissions that the user has for business objects or dictionary items of the type displayed on the form.
                     * @returns {object} An object having the following properties:
                     *
                     * * canUserCreateObject: If true, the user can create objects of the type displayed on the form.
                     * * canUserDeleteObject: If true, the user can delete objects of the type displayed on the form.
                     * * canUserDuplicateObject: If true, the user can duplicate objects of the type displayed on the form.
                     */
                    'actionPermissions': {
                        get: function () {
                            if ($scope.actionPermissions) {
                                return {
                                    "canUserCreateObject": $scope.actionPermissions["canUserCreateObject"],
                                    "canUserDeleteObject": $scope.actionPermissions["canUserDeleteObject"],
                                    "canUserDuplicateObject": $scope.actionPermissions["canUserDuplicateObject"]
                                }
                            }
                        },
                        enumerable: true,
                        configurable: true
                    },

                    /**
                     * @ngdoc property
                     * @name browserTitle
                     * @propertyOf platformModule.object:w6Form
                     * @description (Read-only) The title of the browser window, without the "Service Edge" prefix.
                     * @returns {string} The browser title.
                     */
                    'browserTitle': {
                        get: function () {
                            if ($scope.actionPermissions) {
                                return $scope.actionPermissions["title"];
                            }
                        },
                        enumerable: true,
                        configurable: true
                    },

                    /**
                     * @ngdoc property
                     * @name dirty
                     * @propertyOf platformModule.object:w6Form
                     * @description (Read/write) Indicates whether the form has unsaved changes in the property values of the object.
                     * @returns {boolean} True if the form has unsaved changes. If the user closes a dirty form, the system displays a "Do you want to save?" prompt.
                     *
                     * For example, if a custom panel sets a property of a secondary object, the panel should assign dirty = true to ensure that the form object together with its secondary objects will be saved.
                     */
                    'dirty': {
                        get: function () { return $scope.form.$dirty; },
                        set: function (value) {
                            if (value === true) {
                                $scope.form.$setDirty();
                            }
                            else {
                                $scope.form.$setPristine();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    },

                    /*Documentation: Hidden */
                    /*
                     * @ngdoc property
                     * @name childObjects
                     * @propertyOf platformModule.object:w6Form
                     * @description (Read-only) An array of secondary objects that the user created while editing the form. 
                     *
                     *For example, if the form displays a Task object, the user might edit the Task.Attachments property, click the Add button, and create a new Attachment object. The childObjects property contains the new Attachment. 
                     *
                     * @returns {object[]} An array containing {@link basicInfo.overview:JSON%20Representation%20of%20Business%20Objects JSON} representations of the child objects. ????Is it an array?
                     */
                    'childObjects': {
                        get: function () {
                            return $scope.advancedPlatformOptions.childObjects;
                        },
                        enumerable: true,
                        configurable: true
                    },

                    'objectType': {
                        get: function () { return $scope.objectType; },
                        enumerable: true,
                        configurable: true
                    }
                });
            };

            var showUserMessage = function (type, message) {

                $scope.alertType = type;

                $scope.alertMessage = message;

                if (type === 'error') {
                    w6log.error(message);
                }
            };

            var setVisibilityOfProperty = function (propertyName, isVisible) {
                $scope.hiddenPropPanels[propertyName] = !isVisible;
            };

            var setVisibilityOfTab = function (tabName, isVisible) {
                $scope.hiddenTabs[tabName] = !isVisible;
            };

            var setOKText = function (text) {
                $element.find('#formOKButton').text(text);
            };

            var setApplyText = function (text) {
                $element.find('#formApplyButton').text(text);
            };

            var setCancelText = function (text) {
                $element.find('#formCancelButton').text(text);
            };

            var refreshAuditData = function () {

                $scope.resetAuditData();
            };

            var getCustomPanelData = function (customPanelId) {

                if (!$scope.customPanelsData[customPanelId]) {

                    $scope.customPanelsData[customPanelId] = {};
                }
                return $scope.customPanelsData[customPanelId];
            };

            var getAllCustomPanelsData = function () {

                return $scope.customPanelsData;
            };





            initializeFormAPI();
        }];

        return w6Form;
    }
]);

