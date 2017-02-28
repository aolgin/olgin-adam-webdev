(function() {
    angular
        .module("WebAppMaker")
        .controller("registerController", registerController);

    function registerController(UserService, $location) {
        var vm = this; // vm as in view-model
        vm.register = register;

        function register(newUser) {
            // This is done client-side, so no need to put it within the promise execution
            if (!UserService.doPasswordsMatch(newUser.password, newUser.confirmPass)) {
                vm.error = "Passwords do not match!";
                return;
            }

            var promise = UserService.createUser(newUser);
            promise.then(function (response) {
                var user = response.data;
                if (user) { $location.url('/profile/' + user._id); }
            }).catch(function (err) {
                var status = err.status;
                if (status == 409) {
                    vm.error = "User with that username already exists: " + newUser.username;
                } else {
                    vm.error = "An uncaught error occurred registering your user: \n" + err.data;
                }
            });
        }
    }
})();