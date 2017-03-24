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
            // "findUserByUsername": findUserByUsername,
            "deleteUserById": deleteUserById,
            "updatePassword": updatePassword,
            "login": login,
            "logout": logout,
            "register": register,
            "loggedin": loggedin
        };
        return api;

        // Controller Functions

        function logout(user) {
            return $http.post("/api/logout");
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function loggedin(user) {
            return $http.get('/api/username?=' + username);
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