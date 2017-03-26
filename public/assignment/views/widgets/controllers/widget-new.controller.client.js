(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetNewController", WidgetNewController);

    function WidgetNewController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.form = 'new';

        function init() {
            var promise = WidgetService.findWidgetsByPageId(vm.pageId);
            promise.then(function(response) {
                vm.widgets = response.data;
            });
            vm.type = $routeParams['type'];
        }
        init();

        vm.goToEditor = goToEditor;
        vm.createWidget = createWidget;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;

        function goToEditor(type) {
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/new/" + type);
        }

        function createWidget(widget) {
            if (!widget || !widget.name) {
                vm.error = 'Required fields: Name';
                return;
            }
            widget.widgetType = vm.type;
            var promise = WidgetService.createWidget(vm.pageId, widget);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                }
            }).catch(function (err) {
                var status = err.status;
                if (status == 409) {
                    vm.error = "A widgets exists with that name already! Please use a different name";
                } else {
                    vm.error = "An error occurred trying to update the widget: \n" + err.data;
                }
            });
        }

        function getEditorTemplateUrl(type) {
            if (type) {
                return 'views/widgets/templates/editors/widget-' + type + '-editor.view.client.html';
            }
        }
    }
})();