module.exports = function () {
    var mongoose = require("mongoose");
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
        return UserModel
            .findById(userId)
            .populate("websites", "name dateModified _user")
            .exec();
    }

    function removeUser(userId) {
        return UserModel.remove({_id: userId});
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({
            username: username,
            password: password
        });
    }


    function findUserByUsername(username) {
        return UserModel.findOne({
            username: username
        });
    }

    function updateUser(userId, user) {
        return UserModel.update({
            _id: userId
        },
            {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dateModified: user.dateModified
            }
        );
    }

    function updatePassword(userId, password) {
        return UserModel.update({
            _id: userId
        },
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