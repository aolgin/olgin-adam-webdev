(function(){
    angular
        .module("WebAppMaker")
        .factory('UserService', userService);

    function userService($http) {

        var api = {
            "findUserByCredentials": findUserByCredentials,
            "findUserById": findUserById,
            "updateUser": updateUser,
            "createUser": createUser,
            "findUserByUsername": findUserByUsername,
            "deleteUserById": deleteUserById,
            "doPasswordsMatch": doPasswordsMatch
        };
        return api;

        // Helper Functions

        function doPasswordsMatch(initPass, confirmPass) {
            if (initPass != null && confirmPass != null) {
                return initPass === confirmPass;
            } else {
                return false;
            }
        }

        // Controller Functions

        function findUserByUsername(username) {
            return $http.get("/api/user?username=" + username);
        }

        function deleteUserById(userId) {
            return $http.delete("/api/user/" + userId);
        }

        function createUser(newUser) {
            return $http.post("/api/user" +
                "?username=" + newUser.username +
                "&password=" + newUser.password +
                "&email=" + newUser.email +
                "&firstName=" + newUser.firstName +
                "&lastName=" + newUser.lastName);
        }

        function findUserByCredentials(username, pass) {
            return $http.get("/api/user?username=" + username + "&password=" + pass);
        }

        function findUserById(uid) {
            return $http.get("/api/user/" + uid);
        }

        function updateUser(uid, newUser) {
            return $http.put("/api/user/" + uid +
                "?firstName=" + newUser.firstName +
                "&lastName=" + newUser.lastName +
                "&email=" + newUser.email);
        }
    }
})();