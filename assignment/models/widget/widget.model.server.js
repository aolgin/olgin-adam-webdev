module.exports = function (model) {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var WidgetSchema = require("./widget.schema.server")();
    var WidgetModel  = mongoose.model("WidgetModel", WidgetSchema);

    var api = {
        createWidget: createWidget,
        findWidgetById: findWidgetById,
        findWidgetsForPage: findWidgetsForPage,
        updateWidget: updateWidget,
        removeWidget: removeWidget,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

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

    function removeWidget(wgid) {
        var deferred = q.defer();
        WidgetModel.remove({_id: wgid},
            function (err, status) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }

    // TODO needs some reworking
    function updateWidget(wgid, widget) {
        var deferred = q.defer();
        WidgetModel.update({
                _id: wgid
            },
            {
                name: widget.name,
                description: widget.description,
                dateModified: widget.dateModified
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

    function findWidgetById(wgid) {
        var deferred = q.defer();
        WidgetModel.findById(wgid,
            function (err, widget) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(widget);
                }
            });
        return deferred.promise;
    }

    function createWidget(pid, widget) {
        // var deferred = q.defer();
        return WidgetModel.create(widget)
            .then(function(widgetObj){
                model.pageModel
                    .findPageById(pid)
                    .then(function(pageObj){
                        widgetObj._page = pageObj._id;
                        widgetObj.save();
                        pageObj.widgets.push(widgetObj);
                        pageObj.save();
                        return widgetObj._id;
                    }, function(error){
                        console.log(error);
                    });
            });
        // return deferred.promise;
    }
};