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
        return WebsiteModel
            .findById(wid)
            .populate("pages", "name")
            .exec();
    }

    function findWebsiteByName(name) {
        return WebsiteModel.findOne({ name: name });
    }

    function findWebsiteById(wid) {
        return WebsiteModel.findById(wid);
    }

    function removeWebsite(wid) {
        return WebsiteModel.remove({_id: wid});
    }

    function updateWebsite(wid, site) {
        return WebsiteModel.update({ _id: wid },
            {
                name: site.name,
                description: site.description
            }
        );
    }

    function findWebsitesForUser(userId) {
        return model.userModel.findWebsitesForUser(userId);
    }

    function createWebsite(userId, website) {
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
    }
};