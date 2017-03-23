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
        reorderWidget: reorderWidget,
        findIndexById: findIndexById,
        findWidgetByName: findWidgetByName,
        numWidgetsByPage: numWidgetsByPage,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function findWidgetByName(name) {
        var deferred = q.defer();
        WidgetModel.find({name: name},
            function (err, widget) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(widget);
                }
            });
        return deferred.promise;
    }

    function numWidgetsByPage(pid) {
        var deferred = q.defer();
        WidgetModel.find({_page: pid},
            function (err, results) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(results.length);
                }
            });
        return deferred.promise;
    }

    function findIndexById(wgid) {
        var deferred = q.defer();
        WidgetModel.find({_id: wgid},
            function (err, widget) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(widget.orderIndex);
                }
            });
        return deferred.promise;
    }

    function reorderWidget(pid, start, end) {
        var deferred = q.defer();
        WidgetModel.update(
            {
                _page: pid,
                orderIndex: start
            },
            {
                orderIndex: end
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

    function findWidgetsForPage(pid) {
        console.log("Called!");
        var deferred = q.defer();
        model.pageModel
            .findById(pid)
            .populate("widgets", { sort: { 'orderIndex': 1 }}) //  sort in ascending order
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
    // in this stage, this may overwrite may attributes
    function updateWidget(wgid, widget) {
        var deferred = q.defer();
        // A rather ugly approach, but I'm unsure how else to approach this
        // at the moment. Will return to later.
        switch (widget.widgetType) {
            case "HEADING":
                WidgetModel.update({
                        _id: wgid
                    },
                    {
                        name: widget.name,
                        text: widget.text,
                        size: widget.size,
                        justCreated: false
                    },
                    function (err, status) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(status);
                        }
                    }
                );
                break;
            case "TEXT":
                WidgetModel.update({
                        _id: wgid
                    },
                    {
                        name: widget.name,
                        text: widget.text,
                        rows: widget.rows,
                        placeholder: widget.placeholder,
                        formatted: widget.formatted,
                        justCreated: false
                    },
                    function (err, status) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(status);
                        }
                    }
                );
                break;
            case "HTML":
                WidgetModel.update({
                        _id: wgid
                    },
                    {
                        name: widget.name,
                        text: widget.text,
                        justCreated: false
                    },
                    function (err, status) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(status);
                        }
                    }
                );
                break;
            case "IMAGE":
                WidgetModel.update({
                        _id: wgid
                    },
                    {
                        name: widget.name,
                        text: widget.text,
                        url: widget.url,
                        width: widget.width,
                        justCreated: false
                    },
                    function (err, status) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(status);
                        }
                    }
                );
                break;
            case "YOUTUBE":
                WidgetModel.update({
                        _id: wgid
                    },
                    {
                        name: widget.name,
                        text: widget.text,
                        url: widget.url,
                        width: widget.width,
                        justCreated: false
                    },
                    function (err, status) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(status);
                        }
                    }
                );
                break;
        }
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
        // WidgetModel.create(widget,
        //     function (err, widgetObj) {
        //         if (err) {
        //             deferred.reject(err);
        //         } else {
        //             model.pageModel.findPageById(pid,
        //                 function (err, pageObj) {
        //                     if (err) {
        //                         deferred.reject(err);
        //                     } else {
        //                         widgetObj._page = pageObj._id;
        //                         widgetObj.justCreated = true;
        //                         widgetObj.save();
        //                         pageObj.widgets.push(widgetObj);
        //                         pageObj.save();
        //                         deferred.resolve(widgetObj._id);
        //                     }
        //                 }
        //             )
        //         }
        //     }
        // );
        // return deferred.promise;
        // 58d2fefc979785c359cb4812
        return WidgetModel.create(widget)
            .then(function(widgetObj){
                model.pageModel
                    .findPageById(pid)
                    .then(function(pageObj){
                        widgetObj._page = pageObj._id;
                        widgetObj.justCreated = true;
                        widgetObj.save();
                        pageObj.widgets.push(widgetObj);
                        pageObj.save();
                        return widgetObj._id;
                    }, function(err) {
                        console.log(err);
                    });
            });
    }
};