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
            var answer = confirm("Delete this widget?");
            if (answer) {
                var promise = WidgetService.deleteWidget(vm.widgetId);
                promise.success(function (status) {
                    if (status == 'OK') {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                    }
                }).error(function (err) {
                    vm.error = "An error occurred trying to delete the widget: \n" + err;
                });
            }
        }

        function updateWidget(newWidget) {
            var promise = WidgetService.updateWidget(vm.widgetId, newWidget);
            promise.success(function(status) {
                if (status == 'OK') {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                }
            }).error(function (err) {
                if (err == 'Conflict') {
                    vm.error = "A widgets exists with that name already! Please use a different name";
                } else {
                    vm.error = "An error occurred trying to update the widget: \n" + err;
                }
            });
        }
    }
})();