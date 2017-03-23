module.exports = function () {
    var mongoose = require("mongoose");
    var WidgetSchema = mongoose.Schema({
        _page: {type: mongoose.Schema.Types.ObjectId, ref:"PageModel"},
        widgetType: {
            type: String,
            enum: ["HTML", "HEADING", "LABEL", "TEXT", "LINK", "BUTTON", "IMAGE", "YOUTUBE","DATATABLE", "REPEATER"]
        },
        _user: {type: mongoose.Schema.Types.ObjectId, ref:"UserModel"},
        _website: {type: mongoose.Schema.Types.ObjectId, ref:"WebsiteModel"},
        name: String,
        text: String,
        placeholder: String,
        description: String,
        url: String,
        width: String,
        height: String,
        rows: Number,
        size: Number,
        class: String,
        icon: String,
        deletable: Boolean,
        formatted: Boolean,
        orderIndex: Number,
        justCreated: Boolean
    }, {collection: "widget",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return WidgetSchema;
};