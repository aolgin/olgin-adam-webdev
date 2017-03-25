(function () {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController);

    function PageListController($routeParams, PageService, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            var promise = PageService.findPagesByWebsiteId(vm.websiteId);
            promise.then(function(response) {
                vm.pages = response.data;
            });
            promise = WebsiteService.findWebsiteById(vm.websiteId);
            promise.then(function(response) {
                vm.website = response.data;
            });
        }
        init();
    }
})();