module.exports = function() {
    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema({
        username: {type: String, unique: true, dropDups: true },
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        dateCreated: {type: Date, default: Date.now},
        dateModified: {type: Date, default: Date.now},
        websites: [{type: mongoose.Schema.Types.ObjectId, ref:'WebsiteModel'}]
    }, {collection: "user"});
    return UserSchema;
};