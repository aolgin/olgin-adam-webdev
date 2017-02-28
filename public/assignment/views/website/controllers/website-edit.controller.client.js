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
            siteListPromise.then(function(response) {
                vm.websites = response.data;
            });
            var websitePromise = WebsiteService.findWebsiteById(vm.websiteId);
            websitePromise.then(function(response) {
                vm.website = response.data;
            });
        }
        init();

        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;

        function deleteWebsite() {

            var answer = confirm("Delete this website?");
            if (answer) {
                var promise = WebsiteService.deleteWebsite(vm.websiteId);
                promise.then(function (response) {
                    if (response.status == 200) {
                        $location.url("/user/" + vm.userId + "/website");
                    }
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred deleting your website: \n" + err.data;
                });
            }
        }

        function updateWebsite(newSite) {
            var promise = WebsiteService.updateWebsite(vm.websiteId, newSite);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/user/" + vm.userId + "/website");
                }
            }).catch(function(err) {
                var status = err.status;
                if (status == 409) {
                    vm.error = "A website with that name already exists! Please use a different name.";
                } else {
                    vm.error = "An uncaught error occurred when updating your website: \n" + err.data;
                }
            });
        }
    }
})();