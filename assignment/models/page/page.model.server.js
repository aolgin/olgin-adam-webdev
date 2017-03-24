module.exports = function (model) {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var PageSchema = require("./page.schema.server")();
    var PageModel  = mongoose.model("PageModel", PageSchema);

    var api = {
        createPage: createPage,
        findPageById: findPageById,
        findPagesForWebsite: findPagesForWebsite,
        findWidgetsForPage: findWidgetsForPage,
        updatePage: updatePage,
        removePage: removePage,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    // TODO get around to doing this
    function findWidgetsForPage(pid) {
        return PageModel
            .findById(pid)
            .populate("widgets")
            .exec();
    }

    function removePage(pid) {
        return PageModel.remove({ _id: pid });
    }

    function updatePage(pid, page) {
        return PageModel.update({ _id: pid },
            {
                name: page.name,
                description: page.description
            }
        );
    }

    function findPageById(pid) {
        return PageModel.findById(pid);
    }

    function createPage(wid, page) {
        return PageModel
            .create(page)
            .then(function(pageObj){
                model.websiteModel
                    .findWebsiteById(wid)
                    .then(function(websiteObj){
                        pageObj._website = websiteObj._id;
                        pageObj.save();
                        websiteObj.pages.push(pageObj);
                        return websiteObj.save();
                    }, function(error){
                        console.log(error);
                    });
            });
    }

    function findPagesForWebsite(wid) {
        return model.websiteModel.findPagesForWebsite(wid);
    }
};