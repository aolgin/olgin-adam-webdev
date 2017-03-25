module.exports = function() {
    var mongoose = require("mongoose");

    var UserSchema = mongoose.Schema({
        username: {type: String, unique: true, dropDups: true },
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        websites: [{type: mongoose.Schema.Types.ObjectId, ref:'WebsiteModel'}],
        facebook: {
            id:    String,
            token: String
        }
    }, {collection: "user",
        timestamps: {
            createdAt: "dateCreated",
            updatedAt: "dateModified"
        }
    });
    return UserSchema;
};