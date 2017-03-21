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
            "updatePassword": updatePassword
        };
        return api;

        // Controller Functions

        function findUserByUsername(username) {
            return $http.get("/api/user?username=" + username);
        }

        function deleteUserById(userId) {
            return $http.delete("/api/user/" + userId);
        }

        function createUser(newUser) {
            return $http.post("/api/user", newUser);
        }

        function findUserByCredentials(username, pass) {
            return $http.get("/api/user?username=" + username + "&password=" + pass);
        }

        function findUserById(uid) {
            return $http.get("/api/user/" + uid);
        }

        function updateUser(uid, newUser) {
            return $http.put("/api/user/" + uid, newUser);
        }

        function updatePassword(uid, passwords) {
            return $http.put("/api/user/" + uid, passwords);
        }
    }
})();