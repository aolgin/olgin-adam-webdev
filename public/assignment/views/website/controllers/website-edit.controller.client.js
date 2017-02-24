(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteEditController", WebsiteEditController);

    function WebsiteEditController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];

        function init() {
            var siteListPromise = WebsiteService.findWebsitesByUser(vm.userId);
            siteListPromise.success(function(sites) {
                vm.websites = sites;
            });
            var websitePromise = WebsiteService.findWebsiteById(vm.websiteId);
            websitePromise.success(function(site) {
                vm.website = site;
            });
        }
        init();

        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;

        function deleteWebsite() {

            var answer = confirm("Delete this website?");
            if (answer) {
                var promise = WebsiteService.deleteWebsite(vm.websiteId);
                promise.success(function (status) {
                    if (status == 'OK') {
                        $location.url("/user/" + vm.userId + "/website");
                    }
                }).error(function (err) {
                    vm.error = "An uncaught error occurred deleting your website: \n" + err;
                });
            }
        }

        function updateWebsite(newSite) {
            var promise = WebsiteService.updateWebsite(vm.websiteId, newSite);
            promise.success(function(status) {
                if (status == 'OK') {
                    $location.url("/user/" + vm.userId + "/website");
                }
            }).error(function(err) {
                if (err == 'Conflict') {
                    vm.error = "A website with that name already exists! Please use a different name.";
                } else {
                    vm.error = "An uncaught error occurred when updating your website: \n" + err;
                }
            });
        }
    }
})();