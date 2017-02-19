(function() {
    angular
        .module("WebAppMaker")
        .controller("profileController", profileController);

    function profileController($routeParams, $location, UserService) {
        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            var promise = UserService.findUserById(userId);
            promise.success(function (user) {
                vm.user = user;
            });
        }
        init();

        vm.update = update;
        vm.unregister = unregister;

        function update (newUser) {
            var promise = UserService.updateUser(userId, newUser);
            promise.success(function (status) {
                if (status === 'OK') {
                    vm.message = "Successfully updated user information!";
                } else {
                    vm.error = "Unable to update user";
                }
            });
        }

        function unregister() {
            var promise = UserService.deleteUserById(userId);
            promise.success(function (status) {
               if (status === 'OK') {
                   $location.url('/login');
               } else {
                   vm.error = "Something went wrong unregistering the user...";
               }
            });
        }
    }
})();