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
            var promise = UserService.updatePassword(vm.userId, passList);
            promise.success(function (status) {
                if (status == 'OK') {
                    vm.error = null;
                    vm.message = "Successfully updated password!";
                }
            }).error(function (err) {
                vm.message = null;
                if (err == 'Conflict') {
                    vm.error = 'New passwords do not match!';
                } else if (err == 'Unauthorized') {
                    vm.error = 'Your current password does not match the one on file';
                } else {
                    vm.error = 'An uncaught error occurred when updating your password: \n' + err;
                }
            });
        }
    }
})();