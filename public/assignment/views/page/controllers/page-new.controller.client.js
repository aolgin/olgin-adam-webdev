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
            var promise = PageService.findPagesByWebsiteId(vm.websiteId);
            promise.success(function(pages) {
                vm.pages = pages;
            });
        }
        init();

        vm.createPage = createPage;

        function createPage(newPage) {
            var promise = PageService.createPage(newPage, vm.websiteId);
            promise.success(function(status) {
                if (status == 'OK') {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                }
            }).error(function (err) {
                console.log(err);
                if (err == 'Conflict') {
                    vm.error = "A page with that name already exists! Please use a different name";
                } else {
                    vm.error = "An uncaught error occurred trying to create your page: \n" + err;
                }
            });
        }

    }
})();