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
        return WidgetModel.findOne({name: name});
    }

    function numWidgetsByPage(pid) {
        return WidgetModel.find({_page: pid}).count();
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

    // Will end up just setting the widget found at the startIndex
    // to have an orderIndex of the endIndex.
    // Could cause potential issues with viewing widgets in order since there
    // is no currently no other form of shifting going on
    function reorderWidget(pid, start, end) {
        return WidgetModel.update(
            {
                _page: pid,
                orderIndex: start
            }, { orderIndex: end }
        );
    }

    function findWidgetsForPage(pid) {
        return model.pageModel
            .findById(pid)
            .populate("widgets")
            .exec();
    }

    function removeWidget(wgid) {
        return WidgetModel.remove({ _id: wgid });
    }

    // TODO needs some reworking
    // in this stage, this may overwrite may attributes
    function updateWidget(wgid, widget) {
        // A rather ugly approach, but I'm unsure how else to approach this
        // at the moment. Will return to later.
        switch (widget.widgetType) {
            case "HEADING":
                return WidgetModel.update({ _id: wgid },
                    {
                        name: widget.name,
                        text: widget.text,
                        size: widget.size,
                        justCreated: false
                    }
                );
            case "TEXT":
                return WidgetModel.update({ _id: wgid },
                    {
                        name: widget.name,
                        text: widget.text,
                        rows: widget.rows,
                        placeholder: widget.placeholder,
                        formatted: widget.formatted,
                        justCreated: false
                    }
                );
            case "HTML":
                return WidgetModel.update({ _id: wgid },
                    {
                        name: widget.name,
                        text: widget.text,
                        justCreated: false
                    }
                );
            case "IMAGE":
                return WidgetModel.update({ _id: wgid },
                    {
                        name: widget.name,
                        text: widget.text,
                        url: widget.url,
                        width: widget.width,
                        justCreated: false
                    }
                );
            case "YOUTUBE":
                return WidgetModel.update({ _id: wgid },
                    {
                        name: widget.name,
                        text: widget.text,
                        url: widget.url,
                        width: widget.width,
                        justCreated: false
                    }
                );
        }
    }

    function findWidgetById(wgid) {
        return WidgetModel.findById(wgid);
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