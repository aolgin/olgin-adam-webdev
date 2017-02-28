(function() {
    angular
        .module("WebAppMaker")
        .controller("profileController", profileController);

    function profileController($routeParams, $location, UserService) {
        var vm = this;
        vm.userId = $routeParams['uid'];

        function init() {
            var promise = UserService.findUserById(vm.userId);
            promise.then(function (response) {
                vm.user = response.data;
            });
        }
        init();

        vm.update = update;
        vm.unregister = unregister;

        function update (newUser) {
            var promise = UserService.updateUser(vm.userId, newUser);
            promise.then(function (response) {
                if (response.status == 200) {
                    vm.error = null;
                    vm.message = "Successfully updated user information!";
                }
            }).catch(function(err) {
                vm.message = null;
                var status = err.status;
                if (status == 200) {
                    vm.error = "A user with that username already exists!";
                } else {
                    vm.error = "An uncaught error occurred updating your user information: \n" + err.data;
                }
            });
        }

        function unregister() {
            var answer = confirm("Are you sure?");
            if (answer) {
                var promise = UserService.deleteUserById(vm.userId);
                promise.then(function (response) {
                    if (response.status == 200) {
                        $location.url('/login');
                    }
                }).catch(function (err) {
                    vm.error = "An uncaught error occurred deleting your user: \n" + err.data;
                });
            }
        }
    }
})();