module.exports = function(app) {
    app.get("/api/user", findUserByCredentials);
    app.get("/api/user/:uid", findUserById);
    app.put("/api/user/:uid", updateUser);
    app.post("/api/user", createUser);
    app.delete("/api/user/:uid", deleteUserById);

    var users = [
        {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder"},
        {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
        {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
    ];

    // Helper Functions

    function findIndexById(uid) {
        var index = users.findIndex(function(u) {
            return u._id === uid;
        });
        return index;
    }

    function findUserByUsername(uname) {
        var user = users.find(function (u) {
            // usernames are case-sensitive
            return u.username === uname;
        });
        return user;
    }

    // Service Functions

    function findUserByCredentials(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        var user = users.find(function (u) {
            return u.username === username &&
                u.password === password;
        });
        if(user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    }

    function findUserById(req, res) {
        var userId = req.params['uid'];

        var user = users.find(function (u) {
            return u._id === userId;
        });
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(503);
        }
    }

    function updateUser(req, res) {
        var userId = req.params['uid'];

        console.log(req.body);
        var pass = req.body.newPassword;

        var index = findIndexById(userId);
        // If updating general user information
        if (!pass) {
            var user = req.body;
            if (user.username != users[index].username &&
                findUserByUsername(user.username)) {
                res.sendStatus(409);
                return;
            }

            users[index].firstName = user.firstName;
            users[index].lastName = user.lastName;
            users[index].email = user.email;
            users[index].username = user.username;
            users[index].modified = new Date();
            res.sendStatus(200);
        } else {
            var passList = req.body;
            // If updating password
            if (users[index].password === passList.currentPassword) {
                if (passList.newPassword === passList.confirmPassword) {
                    users[index].password = passList.newPassword;
                    res.sendStatus(200);
                } else {
                    res.sendStatus(409);
                }
            } else {
                res.sendStatus(401);
            }
        }
    }

    function createUser(req, res) {
        var user = req.body;
        var username = user.username;
        var userExists = findUserByUsername(username);
        if (!userExists) {
            var userId = String(new Date().getTime());
            var created = new Date();
            var newUser = {
                "_id": userId,
                "username": user.username,
                "password": user.password,
                "email": user.email,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "created": created,
                "modified": created
            };
            users.push(newUser);
            res.json(newUser);
        } else {
            res.sendStatus(409);
        }
    }

    function deleteUserById(req, res) {
        var index = findIndexById(req.params['uid']);
        users.splice(index, 1);
        res.sendStatus(200);
    }
};