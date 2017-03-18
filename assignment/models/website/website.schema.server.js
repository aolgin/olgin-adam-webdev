module.exports = function () {
    var mongoose = require("mongoose");
    var WebsiteSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref:"UserModel"},
        name: String,
        description: String,
        dateCreated: {type: Date, default: Date.now},
        dateModified: {type: Date, default: Date.now},
        pages: [{type: mongoose.Schema.Types.ObjectId, ref:'PageModel'}]
    }, {collection: "website"});
    return WebsiteSchema;
};