(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteNewController", WebsiteNewController);

    function WebsiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;

        vm.userId = $routeParams['uid'];

        function init() {
            var promise = WebsiteService.findWebsitesByUser(vm.userId);
            promise.then(function(response) {
                vm.websites = response.data;
            });
        }
        init();

        vm.createWebsite = createWebsite;

        function createWebsite(website) {
            if (!website || !website.name) {
                vm.error = "The 'name' field is required for submission";
                return;
            }
            var promise = WebsiteService.createWebsite(website, vm.userId);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/user/" + vm.userId + "/website");
                }
            }).catch(function (err) {
                var status = err.status;
                if (status == 'Conflict') {
                    vm.error = "A website with this name already exists! Please use a different name!";
                } else {
                    vm.error = "An uncaught error occurred creating your website: \n" + err.data;
                }
            });
        }
    }
})();