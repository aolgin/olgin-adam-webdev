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
        removeWebsiteFromUser: removeWebsiteFromUser,
        updatePassword: updatePassword,
        findUserByFacebookId: findUserByFacebookId,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function removeWebsiteFromUser(site) {
        var uid = site._user;
        return UserModel.findById(uid)
            .then(function (userObj) {
                userObj.websites.pull(site);
                return userObj.save();
            }, function (err) {
                console.log(err);
            });
    }

    function removeUser(uid) {
        // Cascade deletes
        return model.widgetModel
            .removeWidgetsByUserId(uid)
            .then(function (response) {
                model.pageModel
                    .removePagesByUserId(uid)
                    .then(function (response) {
                        model.websiteModel
                            .removeWebsitesByUserId(uid)
                            .then(function (response) {
                                return UserModel.remove({_id: uid});
                            }, function(err) {
                                console.log(err);
                            });
                    });
            });
    }

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    function findWebsitesForUser(userId) {
        return UserModel
            .findById(userId)
            .populate("websites", "name dateModified _user")
            .exec();
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({
            username: username,
            password: password
        });
    }


    function findUserByUsername(username) {
        return UserModel.findOne({ username: username });
    }

    function updateUser(userId, user) {
        return UserModel.update({ _id: userId },
            {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        );
    }

    function updatePassword(userId, password) {
        return UserModel.update({ _id: userId },
            {
                password: password
            }
        );
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function createUser(user) {
        return UserModel.create(user);
    }
};