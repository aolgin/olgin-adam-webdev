module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server")();
    var PageModel  = mongoose.model("PageModel", PageSchema);

    var api = {
        createPage: createPage,
        findPageById: findPageById,
        findPagesForWebsite: findPagesForWebsite,
        updatePage: updatePage,
        removePage: removePage,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function findPagesForWebsite(wid) {
        return PageModel
            .findById(wid)
            .populate("pages", "name")
            .exec();
    }

    function removePage(pid) {
        return PageModel.remove({_id: pid});
    }

    function updatePage(pid, page) {
        return PageModel.update({
                _id: pid
            },
            {
                name: page.name,
                description: page.description
            }
        );
    }

    function findPageById(pid) {
        // UserModel.find({_id: userId}) --> returns an array
        return PageModel.findById(pid);
    }

    function createPage(page) {
        return PageModel.create(page);
    }
};