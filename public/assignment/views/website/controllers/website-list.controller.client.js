(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController);

    function WebsiteListController($routeParams, WebsiteService, UserService) {
        var vm = this;
        vm.userId = $routeParams['uid'];

        function init() {
            var promise = WebsiteService.findWebsitesByUser(vm.userId);
            promise.then(function(response) {
               vm.websites = response.data;
            });
            promise = UserService.findUserById(vm.userId);
            promise.then(function(response) {
                vm.user = response.data;
            });
        }
        init();
    }
})();