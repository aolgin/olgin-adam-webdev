module.exports = function () {
    var mongoose = require("mongoose");
    var WebsiteSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref:"UserModel"},
        name: String,
        description: String,
        dateCreated: Date,
        dateModified: Date,
        pages: [{type: mongoose.Schema.Types.ObjectId, ref:'PageModel'}]
    }, {collection: "website"});
    return WebsiteSchema;
};