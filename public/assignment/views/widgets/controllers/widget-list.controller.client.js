(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController);

    function WidgetListController($routeParams, $sce, WidgetService) {
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

        vm.embedYoutubeVideo = embedYoutubeVideo;
        vm.trustUrl = trustUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getWidgetTemplateUrl = getWidgetTemplateUrl;

        function getWidgetTemplateUrl(type) {
            return 'views/widgets/templates/widget-' + type + '.view.client.html';
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function trustUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        /*
        function updateWidgetOrdering() {
            var promise = WidgetService.updateWidgetOrdering(vm.pageId, newOrder);
            promise.success(function(status) {
                if (status == 'OK') {
                    vm.updated = "Changes saved!"
                }
            }).error(function (err) {
                vm.error = "An uncaught error occurred trying to update the widget order: \n" + err;
            });
        }*/

        /*
         Youtube videos won't load properly unless they have an "embed"
         stuck in the middle of it. This function adds in that "embed".
         Nothing happens if it already contains an embed
         */
        function embedYoutubeVideo(url) {
            var index = url.indexOf("embed");
            if (index == -1) {
                var lastIndex = url.lastIndexOf("/");
                var embeddedUrl =
                    url.substring(0, lastIndex) +
                    "/embed" +
                    url.substring(lastIndex, url.length);
                return trustUrl(embeddedUrl);
            }
            return trustUrl(url);
        }
    }
})();