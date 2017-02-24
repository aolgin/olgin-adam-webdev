/*
Generally speaking, always start off any angular JS using a self-contained namespace, as such:

 (function() {

 })();

 */
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
            promise.success(function (user) {
                if (user) { $location.url('/profile/' + user._id); }
            }).error(function (err) {
                if (err == 'Conflict') {
                    vm.error = "User with that username already exists: " + newUser.username;
                } else {
                    vm.error = "An uncaught error occurred registering your user: \n" + err;
                }
            });
        }
    }
})();