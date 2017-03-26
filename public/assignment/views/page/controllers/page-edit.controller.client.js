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
            pageListPromise.then(function(response) {
                vm.pages = response.data;
            });
            var pagePromise = PageService.findPageById(vm.pageId);
            pagePromise.then(function(response) {
                vm.page = response.data;
            });
        }
        init();

        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        function deletePage() {
            var answer = confirm("Delete this page?");
            if (answer) {
                var promise = PageService.deletePage(vm.pageId);
                promise.then(function (response) {
                    if (response.status == 200) {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    }
                }).catch(function (err) {
                    vm.error = "An error uncaught occurred deleting the page: " + err.data;
                });
            }
        }

        function updatePage(newPage) {
            if (!newPage || !newPage.name) {
                vm.error = "The 'name' field is required for submission";
                return;
            }
            var promise = PageService.updatePage(vm.pageId, newPage);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                }
            }).catch(function (err) {
                var status = err.status;
                if (status == 409) {
                    vm.error = "A page with that name already exists! Please use a different name";
                } else {
                    vm.error = "An uncaught error occurred updating the page: \n" + err.data;
                }
            });
        }
    }
})();