module.exports = function () {
    var mongoose = require("mongoose");
    var PageSchema = mongoose.Schema({
        _website: {type: mongoose.Schema.Types.ObjectId, ref:"WebsiteModel"},
        name: String,
        description: String,
        dateCreated: Date,
        dateModified: Date,
        widgets: [{type: mongoose.Schema.Types.ObjectId, ref:'WidgetModel'}]
    }, {collection: "page"});
    return PageSchema;
};