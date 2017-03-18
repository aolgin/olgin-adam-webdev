module.exports = function (model) {
    var mongoose = require("mongoose");
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
        return WebsiteModel
            .findById(wid)
            .populate("pages", "name")
            .exec();
    }

    function findWebsiteByName(name) {
        return WebsiteModel.findOne({
            name: name
        });
    }

    function findWebsiteById(wid) {
        return WebsiteModel.findById(wid);
    }

    function removeWebsite(wid) {
        return WebsiteModel.remove({_id: wid});
    }

    function updateWebsite(wid, site) {
        return WebsiteModel.update({
            _id: wid
        },
            {
                name: site.name,
                description: site.description,
                dateModified: site.dateModified
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