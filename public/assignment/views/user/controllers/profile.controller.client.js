(function() {
    angular
        .module("WebAppMaker")
        .controller("profileController", profileController);

    function profileController($routeParams, $location, UserService) {
        var vm = this;
        vm.userId = $routeParams['uid'];

        function init() {
            var promise = UserService.findUserById(vm.userId);
            promise.success(function (user) {
                vm.user = user;
            });
        }
        init();

        vm.update = update;
        vm.unregister = unregister;

        function update (newUser) {
            var promise = UserService.updateUser(vm.userId, newUser);
            promise.success(function (status) {
                if (status === 'OK') {
                    vm.message = "Successfully updated user information!";
                }
            }).error(function(err) {
                if (err == 'Conflict') {
                    vm.error = "A user with that username already exists!";
                } else {
                    vm.error = "An uncaught error occurred updating your user information: \n" + err;
                }
            });
        }

        function unregister() {
            var answer = confirm("Are you sure?");
            if (answer) {
                var promise = UserService.deleteUserById(vm.userId);
                promise.success(function (status) {
                    if (status === 'OK') {
                        $location.url('/login');
                    }
                }).error(function (err) {
                    vm.error = "An uncaught error occurred deleting your user: \n" + err;
                });
            }
        }
    }
})();