

angular.module("myApp").controller('startController', function ($scope) {

    $scope.template = `<ul class="nav nav-tabs">
            <li><a href="#!empty">Empty tab</a></li>
            <li><a href="#!withNumbericTextbox">tab with numeric textbox</a></li>
        </ul>
        

        <div ng-view></div>`;
});