module.exports = function (model) {
    var mongoose = require("mongoose");
    var q = require('q');
    mongoose.Promise = q.Promise;
    var WidgetSchema = require("./widget.schema.server")();
    var WidgetModel  = mongoose.model("WidgetModel", WidgetSchema);
    var _ = require('underscore');

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
        removeWidgetsByUserId: removeWidgetsByUserId,
        removeWidgetsByWebsiteId: removeWidgetsByWebsiteId,
        removeWidgetsByPageId: removeWidgetsByPageId,
        setModel: setModel
    };
    return api;

    function setModel(_model) {
        model = _model;
    }

    function removeWidgetsByUserId(uid) {
        return WidgetModel.remove({_user: uid});
    }

    function removeWidgetsByWebsiteId(wid) {
        return WidgetModel.remove({_website: wid});
    }

    function removeWidgetsByPageId(pid) {
        return WidgetModel.remove({_page: pid});
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

    // function updateAllOrdering(pid) {
    //     var wlist = findWidgetsForPage(pid);
    //     var sorted = _.sortBy(wlist, 'orderIndex');
    //     for (var i = 0; i < sorted.length; i++) {
    //         var wgid = sorted[i]._id;
    //         WidgetModel.update({_id: wgid},
    //             {orderIndex: i}
    //         );
    //     }
    //     return true;
    // }

    function removeWidget(wgid) {
        return WidgetModel.findById(wgid)
            .then(function (widgetObj) {
                model.pageModel
                    .removeWidgetFromPage(widgetObj)
                    .then(function (response) {
                        return WidgetModel.remove({_id: wgid});
                    });
            });
    }

    // TODO needs some reworking
    function updateWidget(wgid, widget) {
        // A rather ugly approach, but I'm unsure how else to approach this
        // at the moment. Will return to later.
        switch (widget.widgetType) {
            case "HEADING":
                if (widget.size < 0 || widget.size > 6) { widget.size = 3; }
                return WidgetModel.update({ _id: wgid },
                    {
                        name: widget.name,
                        text: widget.text,
                        size: widget.size
                    }
                );
            case "TEXT":
                return WidgetModel.update({ _id: wgid },
                    {
                        name: widget.name,
                        text: widget.text,
                        rows: widget.rows,
                        placeholder: widget.placeholder,
                        formatted: widget.formatted
                    }
                );
            case "HTML":
                return WidgetModel.update({ _id: wgid },
                    {
                        name: widget.name,
                        text: widget.text
                    }
                );
            case "IMAGE":
                return WidgetModel.update({ _id: wgid },
                    {
                        name: widget.name,
                        text: widget.text,
                        url: widget.url,
                        width: widget.width
                    }
                );
            case "YOUTUBE":
                return WidgetModel.update({ _id: wgid },
                    {
                        name: widget.name,
                        text: widget.text,
                        url: widget.url,
                        width: widget.width
                    }
                );
        }
    }

    function findWidgetById(wgid) {
        return WidgetModel.findById(wgid);
    }

    function createWidget(pid, widget) {
        return WidgetModel.create(widget)
            .then(function(widgetObj){
                model.pageModel
                    .findPageById(pid)
                    .then(function(pageObj){
                        widgetObj._page = pageObj._id;
                        widgetObj._website = pageObj._website;
                        widgetObj._user = pageObj._user;
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