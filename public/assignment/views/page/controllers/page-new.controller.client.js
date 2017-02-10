(function () {
    angular
        .module("WebAppMaker")
        .controller("PageNewController", PageNewController);

    function PageNewController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
        }
        init();

        vm.createPage = createPage;

        function createPage(newPage) {
            PageService.createPage(newPage, vm.websiteId);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
        }

    }
})();