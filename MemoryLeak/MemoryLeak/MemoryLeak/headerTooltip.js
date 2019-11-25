
angular.module('myApp').directive('headerTooltip', [function () {

    return {
        restrict: 'A',
        link: function (scope, elem) {

            elem.kendoTooltip({
                animation: false,
                show: function () {
                    this.refresh();
                    var text = this.popup.element.find(".k-tooltip-content").text();
                    if (text == "") {
                        this.hide();
                    }
                },
                content: function (e) {
                    var tooltipText = "";
                    if (e.target && e.target[0]) {
                        if (e.target[0].offsetWidth + 1 < e.target[0].scrollWidth) {
                            tooltipText = e.target.text();
                        }
                    }
                    return tooltipText;
                }
            });

        }
    };


}]);