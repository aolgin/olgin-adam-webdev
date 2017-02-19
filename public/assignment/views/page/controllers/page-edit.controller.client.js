(function () {
    angular
        .module("WebAppMaker")
        .controller("PageEditController", PageEditController);

    function PageEditController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            var pageListPromise = PageService.findPagesByWebsiteId(vm.websiteId);
            pageListPromise.success(function(pages) {
                vm.pages = pages;
            });
            var pagePromise = PageService.findPageById(vm.pageId);
            pagePromise.success(function(page) {
                vm.page = page;
            });
        }
        init();

        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        function deletePage() {
            var promise = PageService.deletePage(vm.pageId);
            promise.success(function(status) {
                if (status == 'OK') {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                } else {
                    vm.error = "An error occurred deleting the page";
                }
            });
        }

        function updatePage(newPage) {
            var promise = PageService.updatePage(vm.pageId, newPage);
            promise.success(function(status) {
                if (status == 'OK') {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                } else {
                    vm.error = "An error occurred deleting the page";
                }
            });
        }
    }
})();