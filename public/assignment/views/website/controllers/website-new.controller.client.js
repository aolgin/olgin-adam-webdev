(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteNewController", WebsiteNewController);

    function WebsiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;

        vm.userId = $routeParams['uid'];

        function init() {
            var promise = WebsiteService.findWebsitesByUser(vm.userId);
            promise.success(function(sites) {
                vm.websites = sites;
            });
        }
        init();

        vm.createWebsite = createWebsite;

        function createWebsite(website) {
            var promise = WebsiteService.createWebsite(website, vm.userId);
            promise.success(function(status) {
                if (status == 'OK') {
                    $location.url("/user/" + vm.userId + "/website");
                }
            }).error(function (err) {
                if (err == 'Conflict') {
                    vm.error = "A website with this name already exists! Please use a different name!";
                } else {
                    vm.error = "An uncaught error occurred creating your website: \n" + err;
                }
            });
        }
    }
})();