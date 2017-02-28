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
            promise.then(function(response) {
                vm.pages = response.data;
            });
        }
        init();

        vm.createPage = createPage;

        function createPage(newPage) {
            var promise = PageService.createPage(newPage, vm.websiteId);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                }
            }).catch(function (err) {
                var status = err.status;
                if (status == 409) {
                    vm.error = "A page with that name already exists! Please use a different name";
                } else {
                    vm.error = "An uncaught error occurred trying to create your page: \n" + err.data;
                }
            });
        }

    }
})();