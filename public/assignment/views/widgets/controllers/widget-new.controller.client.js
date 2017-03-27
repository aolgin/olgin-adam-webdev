(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetNewController", WidgetNewController);

    function WidgetNewController($routeParams, $location, WidgetService, FlickrService) {
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
            vm.showPhotos = false;
            vm.flickrPageNum = 1;
            vm.imageEditorType = "url";
        }
        init();

        vm.goToEditor = goToEditor;
        vm.createWidget = createWidget;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.changeImageEditorType = changeImageEditorType;
        vm.searchFlickr = searchFlickr;
        vm.selectFlickrPhoto = selectFlickrPhoto;

        function searchFlickr(searchTerm, pageChange) {
            // to help with pagination
            vm.flickrPageNum += pageChange;
            if (vm.flickrPageNum < 1) { // don't rerun search if going back from the first page
                vm.flickrPageNum = 1;
                return;
            }

            FlickrService.searchPhotos(searchTerm, vm.flickrPageNum)
                .then(function(response) {
                    data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0, data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                }).catch(function(err) {
                    vm.error = "An error occurred trying to search flickr: \n" + err.data;
                }
            );
            vm.showPhotos = true;
        }

        function selectFlickrPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            vm.widget.url = url;
            vm.showPhotos = false;
        }

        function changeImageEditorType(type) {
            vm.imageEditorType = type;
        }

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