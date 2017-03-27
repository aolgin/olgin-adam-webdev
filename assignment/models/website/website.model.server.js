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
        removeWebsitesByUserId: removeWebsitesByUserId,
        removePageFromWebsite: removePageFromWebsite,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function removeWebsitesByUserId(uid) {
        return WebsiteModel.remove({_user: uid});
    }

    function removePageFromWebsite(page) {
        var wid = page._website;
        return WebsiteModel.findById(wid)
            .then(function (websiteObj) {
                websiteObj.pages.pull(page);
                return websiteObj.save();
            }, function (err) {
                console.log(err);
            });
    }

    function removeWebsite(wid) {
        // Cascade Deletes
        return model.widgetModel.removeWidgetsByWebsiteId(wid)
            .then(function (response) {
                model.pageModel.removePagesByWebsiteId(wid)
                    .then(function (response) {
                        WebsiteModel.findById(wid)
                            .then(function (siteObj) {
                                model.userModel.removeWebsiteFromUser(siteObj)
                                    .then(function (response) {
                                        return WebsiteModel.remove({_id: wid});
                                    }, function(err) {
                                        console.log(err);
                                    })
                            })
                    })
            });
    }

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