module.exports = function () {
    var mongoose = require("mongoose");
    var WebsiteSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref:"UserModel"},
        name: String,
        description: String,
        pages: [{type: mongoose.Schema.Types.ObjectId, ref:'PageModel'}]
    }, {collection: "website",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return WebsiteSchema;
};