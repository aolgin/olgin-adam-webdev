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
            return u._id == uid;
        });
        return index;
    }

    function findUserByUsername(uname) {
        var user = users.find(function (u) {
            return u.username == uname;
        });
        return user;
    }

    // Service Functions

    function findUserByCredentials(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        var user = users.find(function (u) {
            return u.username == username && u.password == password;
        });
        res.json(user);
    }

    function findUserById(req, res) {
        var userId = req.params['uid'];

        var user = users.find(function (u) {
            return u._id == userId;
        });
        res.json(user);
    }

    function updateUser(req, res) {
        var userId = req.params['uid'];
        var username = req.query['username'];
        var firstName = req.query['firstName'];
        var lastName = req.query['lastName'];
        var email = req.query['email'];

        var index = findIndexById(userId);
        users[index].firstName = firstName;
        users[index].lastName = lastName;
        users[index].email = email;
        users[index].username = username;
        users[index].modified = new Date();

        res.sendStatus(200);
    }

    function createUser(req, res) {
        var username = req.query['username'];
        var userExists = findUserByUsername(username);
        if (!userExists) {
            var userId = String(new Date().getTime());
            var created = new Date();
            var newUser = {
                "_id": userId,
                "username": req.query['username'],
                "password": req.query['password'],
                "email": req.query['email'],
                "firstName": req.query['firstName'],
                "lastName": req.query['lastName'],
                "created": created,
                "modified": created
            };
            users.push(newUser);
            res.send(userId);
        } else {
            //TODO verify whether this is what should be sent if user exists
            res.sendStatus(409)
        }
    }

    function deleteUserById(req, res) {
        var index = findIndexById(req.params['uid']);
        users.splice(index, 1);
        res.sendStatus(200);
    }
};