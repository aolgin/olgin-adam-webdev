(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController);

    function WidgetListController($routeParams, $sce, WidgetService, PageService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            var promise = PageService.findPageById(vm.pageId);
            promise.then(function (response) {
               vm.page = response.data;
            });
            renderWidgets();
            //TODO: not the best workaround, but will figure something out later
            // cleanupEmptyWidgets();
        }
        init();

        vm.embedYoutubeVideo = embedYoutubeVideo;
        vm.trustUrl = trustUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getWidgetTemplateUrl = getWidgetTemplateUrl;
        vm.cleanupEmptyWidgets = cleanupEmptyWidgets;

        function getWidgetTemplateUrl(type) {
            return 'views/widgets/templates/widget-' + type + '.view.client.html';
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function trustUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function renderWidgets() {
            var promise = WidgetService.findWidgetsByPageId(vm.pageId);
            promise.then(function(response) {
                vm.widgets = response.data;
            });
        }

        function cleanupEmptyWidgets() {
            var promise = WidgetService.cleanupEmptyWidgets(vm.pageId);
            promise.then(function(response) {
                if(response.status == 200){
                    renderWidgets();
                }
            });
        }

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