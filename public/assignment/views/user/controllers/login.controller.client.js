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
                }
            }).error(function (err) {
                if (err == 'Not Found') {
                    vm.error = 'No user found with the following username: ' + user.username;
                }
                else {
                    vm.error = 'An uncaught error occurred when logging in:\n' + err;
                }
            });
        }
    }
})();