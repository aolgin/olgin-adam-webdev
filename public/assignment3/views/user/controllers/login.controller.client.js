/*
Generally speaking, always start off any angular JS using a self-contained namespace, as such:

 (function() {

 })();

 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("loginController", loginController);

    function loginController(UserService, $location) {
        var vm = this; // vm as in view-model
        vm.login = login;

        function login(user) {
            var loginUser = UserService.findUserByCredentials(user.username, user.password);
            if (loginUser != null) {
                $location.url('/profile/' + loginUser._id);
            } else {
                vm.error = "No such user found!";
            }
        }
    }
})();