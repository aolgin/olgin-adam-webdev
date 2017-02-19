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
            var promise = WebsiteService.createWebsite(website);
            promise.success(function(status) {
                if (status == 'OK') {
                    $location.url("/user/" + vm.userId + "/website");
                } else {
                    vm.error = "An error occurred trying to create the website";
                }
            });
        }
    }
})();