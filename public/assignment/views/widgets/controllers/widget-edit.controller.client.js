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
            var promise = WidgetService.findWidgetById(vm.widgetId);
            promise.success(function(widget) {
               vm.widget = widget;
            });
        }
        init();

        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;

        function getEditorTemplateUrl(type) {
            return 'views/widgets/templates/editors/widget-' + type + '-editor.view.client.html';
        }

        function deleteWidget() {
            var promise = WidgetService.deleteWidget(vm.widgetId);
            promise.success(function(status) {
               if (status == 'OK') {
                   $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
               } else {
                   vm.error = "An error occurred trying to delete the widget";
               }
            });
        }

        function updateWidget(newWidget) {
            var promise = WidgetService.updateWidget(vm.widgetId, newWidget);
            promise.success(function(status) {
                if (status == 'OK') {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                } else {
                    vm.error = "An error occurred trying to delete the widget";
                }
            });
        }

    }
})();