(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteNewController", WebsiteNewController);

    function WebsiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;

        vm.userId = $routeParams['uid'];

        function init() {
            vm.websites = WebsiteService.findAllWebsitesForUser(vm.userId);
        }
        init();

        vm.createWebsite = createWebsite;

        function createWebsite(website) {
            WebsiteService.createWebsite(website, vm.userId);
            //vm.websites = WebsiteService.findAllWebsitesForUser(vm.userId);
            $location.url("/user/" + vm.userId + "/website");
        }
    }
})();