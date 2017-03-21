(function() {
    angular
        .module("WebAppMaker")
        .controller("passwordController", passwordController);

    function passwordController(UserService, $routeParams) {
        var vm = this; // vm as in view-model
        vm.userId = $routeParams['uid'];
        vm.updatePassword = updatePassword;

        function init(){}
        init();

        function updatePassword(passList) {
            if (passList.newPassword != passList.confirmPassword) {
                vm.error = "Passwords do not match!";
                return;
            }

            var promise = UserService.updatePassword(vm.userId, passList);
            promise.then(function (response) {
                if (response.status == 200) {
                    vm.error = null;
                    vm.message = "Successfully updated password!";
                }
            }).catch(function (err) {
                var status = err.status;
                vm.message = null;
                if (status == 401) {
                    vm.error = 'Your current password does not match the one on file';
                } else {
                    vm.error = 'An uncaught error occurred when updating your password: \n' + err.data;
                }
            });
        }
    }
})();