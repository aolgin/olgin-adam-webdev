(function() {
    angular
        .module("WebAppMaker")
        .controller("profileController", profileController);

    function profileController($routeParams, $location, UserService) {
        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            vm.user = UserService.findUserById(userId);
        }
        init();

        vm.update = update;
        vm.unregister = unregister;

        function update (newUser) {
            var user = UserService.updateUser(userId, newUser);
            if (user == null) {
                vm.error = "Unable to update user";
            } else {
                vm.message = "Successfully updated user information!";
            }
        }

        function unregister() {
            var deletedUser = UserService.deleteUserById(userId);
            $location.url('/login');
        }
    }
})();