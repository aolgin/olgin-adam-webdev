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
        // cascadeDelete: cascadeDelete,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    // TODO: For potential future use
    // function cascadeDelete(wid) {
    //     var deferred = q.defer();
    //     // Currently just a pseudo-code implementation
    //     for (page in pages) {
    //         var pid = page._id;
    //         model.pageModel.cascadeDelete(pid)
    //         model.pageModel.remove(pid);
    //         WebsiteModel.update({
    //             _id: wid,
    //         },
    //             pages: removePageIdFromArray
    //         )
    //     }
    //     return deferred.promise;
    //
    // }

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
        // WebsiteModel
        //     .create(website,
        //         function (err, websiteObj) {
        //             console.log("Created Website");
        //             if (err) {
        //                 console.log("Deferred at stage 1");
        //                 deferred.reject(err);
        //             } else {
        //                 console.log("Made it into round 1");
        //                 model.userModel.findUserById(userId,
        //                     function (err, userObj) {
        //                         console.log('Found user');
        //                         if (err) {
        //                             console.log("Deferred at stage 2");
        //                             deferred.reject(err);
        //                         } else {
        //                             console.log("Made it into round 2");
        //                             websiteObj._user = userObj._id;
        //                             websiteObj.save();
        //                             userObj.websites.push(websiteObj);
        //                             deferred.resolve(userObj.save());
        //                             console.log("Resolved!");
        //                         }
        //                     })
        //             }
        //         });
        // return deferred.promise;

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