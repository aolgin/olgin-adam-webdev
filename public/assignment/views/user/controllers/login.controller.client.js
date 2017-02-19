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

        function init(){}
        init();

        function login(user) {
            var promise = UserService.findUserByCredentials(user.username, user.password);
            promise.success(function (user) {
                if (user) {
                    $location.url('/profile/' + user._id);
                } else {
                    vm.error = "No such user found!";
                }
            });
        }
    }
})();