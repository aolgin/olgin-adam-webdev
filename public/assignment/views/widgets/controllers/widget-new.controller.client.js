(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetNewController", WidgetNewController);

    function WidgetNewController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            var promise = WidgetService.findWidgetsByPageId(vm.pageId);
            promise.then(function(response) {
                vm.widgets = response.data;
            });
        }
        init();

        vm.createWidget = createWidget;

        function createWidget(type) {
            var promise = WidgetService.createWidget(vm.pageId, type);
            promise.then(function(response) {
                var wgid = response.data;
                if (wgid) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + wgid);
                }
            }).catch(function(err) {
                vm.error = "An error occurred creating new widget: \n" + err.data;
            });
        }
    }
})();