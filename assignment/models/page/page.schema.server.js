module.exports = function () {
    var mongoose = require("mongoose");
    var PageSchema = mongoose.Schema({
        _website: {type: mongoose.Schema.Types.ObjectId, ref: "WebsiteModel"},
        _user: {type: mongoose.Schema.Types.ObjectId, ref: "UserModel"},
        name: String,
        description: String,
        widgets: [{type: mongoose.Schema.Types.ObjectId, ref: 'WidgetModel'}]
    }, {collection: "page",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return PageSchema;
};