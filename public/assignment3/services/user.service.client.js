(function(){
    angular
        .module("WebAppMaker")
        .factory('UserService', userService);

    function userService() {
        var users = [
            {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
            {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
            {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
        ];

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

        function doPasswordsMatch(initPass, confirmPass) {
            if (initPass != null && confirmPass != null) {
                return initPass === confirmPass;
            } else {
                return false;
            }
        }

        function findUserByUsername(username) {
            for (var u in users) { // u acts as an index here, not an object
                var user = users[u];
                if (user.username === username) {
                    return angular.copy(users[u]);
                }
            }
            return null;
        }

        function deleteUserById(userId) {
            for (var u in users) { // u acts as an index here, not an object
                var user = users[u];
                if (user._id === userId) {
                    users.splice(u, 1);
                    //return user;
                    break;
                }
            }
            //return null;
        }

        function createUser(newUser) {
            var userExists = findUserByUsername(newUser.username);
            if (userExists == null) {
                var uid = String(new Date().getTime());
                var newUser = {
                    "_id": uid,
                    "username": newUser.username,
                    "password": newUser.password,
                    "email": newUser.email,
                    "firstName": newUser.firstName,
                    "lastName": newUser.lastName
                };
                users.push(newUser);
                return uid;
            } else {
                return null;
            }
        }

        function findUserByCredentials(username, pass) {
            for (var u in users) { // u acts as an index here, not an object
                var user = users[u];
                if (user.username === username &&
                    user.password === pass) {
                    return angular.copy(user);
                }
            }
            return null;
        }

        function findUserById(uid) {
            for (var u in users) { // u acts as an index here, not an object
                var user = users[u];
                if (user._id === uid) {
                    return angular.copy(user);
                }
            }
            return null;
        }

        function updateUser(uid, newUser) {
            for (var u in users) { // u acts as an index here, not an object
                var user = users[u];
                if (user._id === uid) {
                    users[u].firstName = newUser.firstName;
                    users[u].lastName = newUser.lastName;
                    users[u].email = newUser.email;
                    // may not want them to update everything
                    return angular.copy(user);
                }
            }
            return null;
        }
    }
})();