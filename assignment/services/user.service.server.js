module.exports = function(app, model) {
    var userModel = model.userModel;

    app.get("/api/user", findUserByCredentials);
    app.get("/api/user/:uid", findUserById);
    app.put("/api/user/:uid", updateUser);
    app.post("/api/user", createUser);
    app.delete("/api/user/:uid", deleteUserById);

    // Helper Functions

    function findUserByUsername(uname) {
        userModel
            .findUserByUsername(uname)
            .then(function(user) {
                return user;
            }, function (err) {
                console.log(err);
                return null;
            });
    }

    // Service Functions

    function findUserByCredentials(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        userModel
            .findUserByCredentials(username, password)
            .then(function(user) {
                res.json(user);
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(404);
            });
    }

    function findUserById(req, res) {
        var uid = req.params['uid'];

        userModel
            .findUserById(uid)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                console.log(err);
                res.sendStatus(404);
            });
    }

    function updatePassword(req, res) {
        var uid = req.params['uid'];
        var passList = req.body;

        var userToUpdate;
        userModel
            .findUserById(uid)
            .then(function (user) {
                userToUpdate = user;
            }, function (err) {
                userToUpdate = null;
                console.log(err);
                res.sendStatus(404);
            });

        if (userToUpdate && userToUpdate != null) {
            if (userToUpdate.password === passList.currentPassword) {
                if (passList.newPassword === passList.confirmPassword) {
                    userToUpdate.password = passList.newPassword;
                    userModel.updateUser(uid, userToUpdate)
                        .then(function (response) {
                            res.sendStatus(200);
                        }, function (err) {
                            console.log(err);
                            res.sendStatus(500);
                        });
                } else {
                    res.sendStatus(409);
                }
            } else {
                res.sendStatus(401);
            }
        } else { res.sendStatus(500); }
    }

    function updateUser(req, res) {
        var uid = req.params['uid'];
        var newInfo = req.body;
        newInfo.dateModified = new Date();

        if (newInfo.newPassword) {
            updatePassword(req, res);
            return;
        }

        userModel
            .updateUser(uid, newInfo)
            .then(function (response) {
                res.sendStatus(response.status);
            }, function (err) {
                console.log(err);
                res.sendStatus(400);
            });
    }

    function createUser(req, res) {
        var newUser = req.body;

        var userExists = findUserByUsername(newUser.username);
        if (!userExists) {
            userModel
                .createUser(newUser)
                .then(function (user) {
                    res.json(user);
                }, function (err) {
                    console.log(err);
                    res.sendStatus(500);
                });
        }
    }

    function deleteUserById(req, res) {
        var uid = req.params['uid'];

        userModel
            .removeUser(uid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }
};