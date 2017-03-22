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
                if (user) {
                    return user;
                } else {
                    return null;
                }
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
                if (user) {
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findUserById(req, res) {
        var uid = req.params['uid'];

        userModel
            .findUserById(uid)
            .then(function (user) {
                if (user) {
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function updatePassword(req, res) {
        var uid = req.params['uid'];
        var passList = req.body;

        userModel
            .findUserById(uid)
            .then(function (user) {
                if (user) {
                    if (user.password === passList.currentPassword) {
                        userModel.updatePassword(uid, passList.newPassword)
                            .then(function (response) {
                                res.sendStatus(200);
                            }).catch(function (err) {
                                console.log(err);
                                res.sendStatus(500);
                            });
                    } else {
                        res.sendStatus(401);
                    }
                } else {
                    res.sendStatus(404);
                }
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function updateUser(req, res) {
        var uid = req.params['uid'];
        var newInfo = req.body;

        if (newInfo.newPassword) {
            updatePassword(req, res);
            return;
        }

        var promise = userModel.updateUser(uid, newInfo);
        promise.then(function (response) {
            res.sendStatus(200);
        }).catch(function (err) {
            console.log(err);
            // If username is a duplicate
            if (err.code == 11000) {
                res.sendStatus(409);
            } else {
                res.sendStatus(500);
            }
        });
    }

    function createUser(req, res) {
        var newUser = req.body;
        var promise = userModel.createUser(newUser);
        promise.then(function (user) {
            if (user) {
                res.json(user);
            }
        })
        .catch(function (err) {
            console.log(err);
            // if username is a duplicate
            if (err.code == 11000) {
                res.sendStatus(409);
            } else {
                res.sendStatus(500);
            }
        });
    }

    function deleteUserById(req, res) {
        var uid = req.params['uid'];

        userModel
            .removeUser(uid)
            .then(function (response) {
                res.sendStatus(200);
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }
};