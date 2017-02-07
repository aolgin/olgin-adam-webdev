(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetEditController", WidgetEditController);

    function WidgetEditController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.widgetId = $routeParams['wgid'];

        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
            vm.widget = WidgetService.findWidgetById(vm.widgetId);
        }
        init();

        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;

        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetId);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
        }

        function updateWidget(newWidget) {
            WidgetService.updateWidget(vm.widgetId, newWidget);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
        }

    }
})();