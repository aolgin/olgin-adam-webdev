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
        ]

        var api = {
            "findUserByCredentials": findUserByCredentials,
            "findUserById": findUserById,
            "updateUser": updateUser,
            "createUser": createUser,
            "findUserByUsername": findUserByUsername,
            "deleteUser": deleteUser
        };
        return api;

        function findUserByUsername(username) {
            for (var u in users) { // u acts as an index here, not an object
                var user = users[u];
                if (user.username === username) {
                    return angular.copy(users[u]);
                }
            }
            return null;
        }

        function deleteUser(userId) {
            for (var u in users) { // u acts as an index here, not an object
                var user = users[u];
                if (user._id === userId) {
                    users.splice(u, 1);
                    return user;
                }
            }
            return null;
        }

        function createUser(newUser) {
            //TODO This is currently flawed due to only failing if the combination doesn't exist. Will need to fix
            var userExists = findUserByUsername(newUser.username);
            if (userExists == null) {
                var uid = new Date().getTime();
                var newUser = {
                    "_id": uid,
                    "username": newUser.username,
                    "password": newUser.password,
                    "firstname": newUser.firstname,
                    "lastname": newUser.lastname
                };
                users.push[newUser];
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