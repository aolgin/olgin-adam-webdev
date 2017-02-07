(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteEditController", WebsiteEditController);

    function WebsiteEditController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];

        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            vm.website = WebsiteService.findWebsiteById(vm.websiteId);
        }
        init();

        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;

        function deleteWebsite() {
            WebsiteService.deleteWebsite(vm.websiteId);
            $location.url("/user/" + vm.userId + "/website");
        }

        function updateWebsite(newSite) {
            WebsiteService.updateWebsite(vm.websiteId, newSite);
            $location.url("/user/" + vm.userId + "/website");
        }
        console.log(vm.websites);
    }
})();