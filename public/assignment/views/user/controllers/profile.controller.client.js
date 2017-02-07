(function() {
    angular
        .module("WebAppMaker")
        .controller("profileController", profileController);

    function profileController($routeParams, UserService) {
        var vm = this;
        var userId = $routeParams['uid'];
        vm.user = UserService.findUserById(userId);
        vm.update = function (newUser) {
            var user = UserService.updateUser(userId, newUser);
            if (user == null) {
                vm.error = "Unable to update user";
            } else {
                vm.message = "Successfully updated user information!";
            }
        };

        console.log(vm.user);
    }
})();