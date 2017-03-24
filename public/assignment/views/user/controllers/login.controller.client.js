(function() {
    angular
        .module("WebAppMaker")
        .controller("loginController", loginController);

    function loginController(UserService, $location, $rootScope) {
        var vm = this; // vm as in view-model
        vm.login = login;

        function init(){}
        init();

        function login(user) {
            var promise = UserService.login(user)
            promise.then(function(response) {
                    var user = response.data;
                    $rootScope.currentUser = user;
                    $location.url("/profile/" + user._id);
                }).catch(function (err) {
                    console.log(err);
                    var status = err.status;
                    if (status == 404) {
                        vm.error = 'No user found matching those credentials';
                    } else {
                        vm.error = 'An uncaught error occurred when logging in:\n' + err.data;
                    }
                });
            // var promise = UserService.findUserByCredentials(user.username, user.password);
            // promise.then(function (response) {
            //     var user = response.data;
            //     if (user) {
            //         $location.url('/profile/' + user._id);
            //     }
            // }).catch(function (err) {
            //     var status = err.status;
            //     if (status == 404) {
            //         vm.error = 'No user found matching those credentials';
            //     } else {
            //         vm.error = 'An uncaught error occurred when logging in:\n' + err.data;
            //     }
            // });
        }
    }
})();