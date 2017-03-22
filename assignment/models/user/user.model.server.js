module.exports = function () {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var UserSchema = require("./user.schema.server")();
    var UserModel  = mongoose.model("UserModel", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        findWebsitesForUser: findWebsitesForUser,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        removeUser: removeUser,
        updatePassword: updatePassword,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function findWebsitesForUser(userId) {
        var deferred = q.defer();
        UserModel
            .findById(userId)
            .populate("websites", "name dateModified _user")
            .exec(function (err, results) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(results);
                }
            });
        return deferred.promise;
    }

    function removeUser(userId) {
        var deferred = q.defer();
        UserModel.remove(
            {_id: userId},
            function (err, status) {
                if (err) {
                    deferred.reject();
                } else {
                    deferred.resolve(status);
                }
        });
        return deferred.promise;
    }

    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        UserModel.findOne({
            username: username,
            password: password
        }, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }


    function findUserByUsername(username) {
        var deferred = q.defer();
        UserModel.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function updateUser(userId, user) {
        var deferred = q.defer();
        UserModel.update({
            _id: userId
        },
            {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dateModified: user.dateModified
            },
            function (err, status) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            }
        );
        return deferred.promise;
    }

    function updatePassword(userId, password) {
        var deferred = q.defer();
        UserModel.update({
            _id: userId
        },
            {
                password: password
            }, function (err, status) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            }
        );
        return deferred.promise;
    }

    function findUserById(userId) {
        var deferred = q.defer();
        UserModel.findById(userId, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function createUser(user) {
        var deferred = q.defer();
        UserModel.create(user, function (err, user) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }
};