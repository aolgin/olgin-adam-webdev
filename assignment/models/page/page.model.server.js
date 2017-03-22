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
        var deferred = q.defer();
        PageModel
            .findById(pid)
            .populate("widgets")
            .exec(
                function (err, results) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(results);
                    }
                }
            );
        return deferred.promise;
    }

    function removePage(pid) {
        var deferred = q.defer();
        PageModel.remove({_id: pid},
            function (err, status) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }

    function updatePage(pid, page) {
        var deferred = q.defer();
        PageModel.update({
                _id: pid
            },
            {
                name: page.name,
                description: page.description,
                dateModified: page.dateModified
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

    function findPageById(pid) {
        var deferred = q.defer();
        PageModel.findById(pid,
            function (err, page) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(page);
                }
            });
        return deferred.promise;
    }

    function createPage(wid, page) {
        // var deferred = q.defer();
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
        // return deferred.promise;
    }

    function findPagesForWebsite(wid) {
        var deferred = q.defer();
        model.websiteModel.findPagesForWebsite(wid,
            function (err, results) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(results);
                }
            });
        return deferred.promise;
    }
};