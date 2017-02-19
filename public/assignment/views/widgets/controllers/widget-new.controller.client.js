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
            promise.success(function(w) {
                vm.widgets = w;
            });
        }
        init();

        vm.createWidget = createWidget;

        function createWidget(type) {
            var promise = WidgetService.createWidget(vm.pageId, type);
            //TODO return to this
            promise.success(function(wgid) {
               if (wgid) {
                   $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + wgid);
               } else {
                   vm.error = "An error occurred creating new widget";
               }
            });
        }
    }
})();