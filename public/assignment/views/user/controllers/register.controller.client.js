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

        function register(user) {
            var newUserId = UserService.createUser(user);
            if (newUserId == null) {
                vm.error = "User already exists!";
            } else {
                $location.url('/profile/' + newUserId);
            }
        }
    }
})();