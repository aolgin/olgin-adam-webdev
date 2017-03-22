module.exports = function (model) {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var WebsiteSchema = require("./website.schema.server")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);

    var api = {
        createWebsite: createWebsite,
        findWebsitesForUser: findWebsitesForUser,
        updateWebsite: updateWebsite,
        removeWebsite: removeWebsite,
        findWebsiteById: findWebsiteById,
        findWebsiteByName: findWebsiteByName,
        findPagesForWebsite: findPagesForWebsite,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function findPagesForWebsite(wid) {
        var deferred = q.defer();
        WebsiteModel
            .findById(wid)
            .populate("pages", "name")
            .exec(function (err, results) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(results);
                }
            });
        return deferred.promise;
    }

    function findWebsiteByName(name) {
        var deferred = q.defer();
        WebsiteModel.findOne({
            name: name
        }, function (err, site) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(site);
            }
        });
        return deferred.promise;
    }

    function findWebsiteById(wid) {
        var deferred = q.defer();
        WebsiteModel.findById(wid,
            function (err, site) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(site);
                }
            });
        return deferred.promise;
    }

    function removeWebsite(wid) {
        var deferred = q.defer();
        WebsiteModel.remove({_id: wid},
            function (err, status) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }

    function updateWebsite(wid, site) {
        var deferred = q.defer();
        WebsiteModel.update({
            _id: wid
        },
            {
                name: site.name,
                description: site.description
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

    function findWebsitesForUser(userId) {
        var deferred = q.defer();
        model.userModel.findWebsitesForUser(userId,
            function (err, results) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(results);
                }
            });
        return deferred.promise;
    }

    // How to implement q in this?
    function createWebsite(userId, website) {
        // var deferred = q.defer();
        return WebsiteModel
            .create(website)
            .then(function(websiteObj){
                model.userModel
                    .findUserById(userId)
                    .then(function(userObj){
                        websiteObj._user = userObj._id;
                        websiteObj.save();
                        userObj.websites.push(websiteObj);
                        return userObj.save();
                    }, function(error){
                        console.log(error);
                    });
            });
        // return deferred.promise;
    }
};