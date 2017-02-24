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
            var answer = confirm("Delete this page?");
            if (answer) {
                var promise = PageService.deletePage(vm.pageId);
                promise.success(function (status) {
                    if (status == 'OK') {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    }
                }).error(function (err) {
                    vm.error = "An error uncaught occurred deleting the page: " + err;
                });
            }
        }

        function updatePage(newPage) {
            var promise = PageService.updatePage(vm.pageId, newPage);
            promise.success(function(status) {
                if (status == 'OK') {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                }
            }).error(function (err) {
                if (err == 'Conflict') {
                    vm.error = "A page with that name already exists! Please use a different name";
                } else {
                    vm.error = "An uncaught error occurred updating the page: \n" + err;
                }
            });
        }
    }
})();