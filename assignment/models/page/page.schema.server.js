module.exports = function () {
    var mongoose = require("mongoose");
    var PageSchema = mongoose.Schema({
        _website: {type: mongoose.Schema.Types.ObjectId, ref:"WebsiteModel"},
        _user: {type: mongoose.Schema.Types.ObjectId, ref:"UserModel"},
        name: String,
        description: String,
        dateCreated: {type: Date, default: Date.now},
        dateModified: {type: Date, default: Date.now},
        widgets: [{type: mongoose.Schema.Types.ObjectId, ref:'WidgetModel'}]
    }, {collection: "page"});
    return PageSchema;
};