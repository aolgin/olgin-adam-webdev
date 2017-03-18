module.exports = function (model) {
    var mongoose = require("mongoose");
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

    function findWidgetsForPage(wgid) {
        return WidgetModel
            .findById(wgid)
            .populate("widgets", "name")
            .exec();
    }

    function removeWidget(wgid) {
        return WidgetModel.remove({_id: wgid});
    }

    // TODO needs some reworking
    function updateWidget(wgid, widget) {
        return WidgetModel.update({
                _id: wgid
            },
            {
                name: widget.name,
                description: widget.description
            }
        );
    }

    function findWidgetById(wgid) {
        return WidgetModel.findById(wgid);
    }

    function createWidget(widget) {
        return WidgetModel.create(widget);
    }
};