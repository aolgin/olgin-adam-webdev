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
          "findUserById": findUserById
        };
        return api;

        function findUserByCredentials(username, pass) {
            for (var u in users) { // u acts as an index here, not an object
                var user = users[u];
                if (user.username === username &&
                    user.password === pass) {
                    return user;
                }
            }
            return null;
        }

        function findUserById(id) {
            for (var u in users) { // u acts as an index here, not an object
                var user = users[u];
                if (user.uid === id) {
                    return user;
                }
            }
            return null;
        }
    }
})();