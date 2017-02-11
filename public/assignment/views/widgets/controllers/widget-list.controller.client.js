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
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
        }
        init();

        vm.embedYoutubeVideo = embedYoutubeVideo;
        vm.trustUrl = trustUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getWidgetTemplateUrl = getWidgetTemplateUrl;

        function getWidgetTemplateUrl(type) {
            return 'views/widgets/templates/widget-' + type.toLowerCase() + '.view.client.html';
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function trustUrl(url) {
            return $sce.trustAsResourceUrl(url);
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