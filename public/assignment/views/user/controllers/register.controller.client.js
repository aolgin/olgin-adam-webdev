(function() {
    angular
        .module("WebAppMaker")
        .controller("registerController", registerController);

    function registerController(UserService, $location, $rootScope) {
        var vm = this; // vm as in view-model
        vm.register = register;

        function register(newUser) {
            // This is done client-side, so no need to put it within the promise execution
            if (!newUser || !newUser.username || !newUser.password || !newUser.confirmPass) {
                vm.error = 'Required fields: Username, Password, Confirm Password';
                return;
            } else if (newUser.password != newUser.confirmPass) {
                vm.error = "Passwords do not match!";
                return;
            }

            UserService.register(newUser)
                .then(
                    function(response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url("/profile/" + user._id);
                    }
                ).catch(function (err) {
                    var status = err.status;
                    if (status == 409) {
                        vm.error = "User with that username already exists: " + newUser.username;
                    } else {
                        vm.error = "An uncaught error occurred registering your user: \n" + err.data;
                    }
                });

            // var promise = UserService.createUser(newUser);
            // promise.then(function (response) {
            //     var user = response.data;
            //     if (user) { $location.url('/profile/' + user._id); }
            // }).catch(function (err) {
            //     var status = err.status;
            //     if (status == 409) {
            //         vm.error = "User with that username already exists: " + newUser.username;
            //     } else {
            //         vm.error = "An uncaught error occurred registering your user: \n" + err.data;
            //     }
            // });
        }
    }
})();