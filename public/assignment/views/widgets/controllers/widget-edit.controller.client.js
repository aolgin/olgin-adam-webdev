(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetEditController", WidgetEditController);

    function WidgetEditController($routeParams, $location, $sce, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.widgetId = $routeParams['wgid'];

        function init() {
            var promise = WidgetService.findWidgetById(vm.widgetId);
            promise.then(function(response) {
               vm.widget = response.data;
            });
        }
        init();

        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.trustUrl = trustUrl;
        vm.getTrustedHtml = getTrustedHtml;

        function trustUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getEditorTemplateUrl(type) {
            return 'views/widgets/templates/editors/widget-' + type + '-editor.view.client.html';
        }

        function uploadImage(file) {
            var promise = WidgetService.uploadImage(vm.widgetId, file);
            promise.then(function (response) {
                if (response.status == 200) {
                    vm.error = null;
                    vm.message = "Image uploaded successfully!";
                }
            }).catch(function(err) {
                vm.message = null;
                vm.error = "An Error occurred trying to upload the image: " + err.data;
            });
        }

        function deleteWidget() {
            var answer = confirm("Delete this widget?");
            if (answer) {
                var promise = WidgetService.deleteWidget(vm.widgetId);
                promise.then(function (response) {
                    if (response.status == 200) {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                    }
                }).catch(function(err) {
                    vm.error = "An error occurred trying to delete the widget: \n" + err.data;
                });
            }
        }

        function updateWidget(newWidget) {
            var promise = WidgetService.updateWidget(vm.widgetId, newWidget);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                }
            }).catch(function (err) {
                var status = err.status;
                if (status == 409) {
                    vm.error = "A widgets exists with that name already! Please use a different name";
                } else if (status == 400) {
                    vm.error = "Name field is required";
                } else {
                    vm.error = "An error occurred trying to update the widget: \n" + err.data;
                }
            });
        }
    }
})();