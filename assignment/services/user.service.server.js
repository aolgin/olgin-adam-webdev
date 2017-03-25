module.exports = function(app, model) {
    var userModel = model.userModel;
    var passport = require('passport');
    var bcrypt = require('bcrypt-nodejs');
    var auth = authorized;
    var LocalStrategy = require('passport-local').Strategy;
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    var FacebookStrategy = require('passport-facebook').Strategy;


    app.get("/api/user", findUserByCredentials);
    app.get("/api/user/:uid", findUserById);
    // app.put("/api/user/:uid", updateUser);
    // app.post("/api/user", createUser);
    // app.delete("/api/user/:uid", deleteUserById);

    // Authentication and passport related
    app.post  ('/api/login', passport.authenticate('local'), login);
    app.post  ('/api/logout',         logout);
    app.post  ('/api/register',       register);
    app.post  ('/api/user',     auth, createUser);
    app.get   ('/api/loggedin',       loggedin);
    // app.get   ('/api/user',     auth, findAllUsers);
    app.put   ('/api/user/:id', auth, updateUser);
    app.delete('/api/user/:id', auth, deleteUserById);
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#/profile', // how to get user id here?
            failureRedirect: '/#/login'
        }));

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }


    passport.use(new LocalStrategy(localStrategy));
    function localStrategy(username, password, done) {
        userModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    if (!user) { return done(null, false); }
                    return done(null, user);
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        // if(user && bcrypt.compareSync(password, user.password)) {
        //     return done(null, user);
        // } else {
        //     return done(null, false);
        // }
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }


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