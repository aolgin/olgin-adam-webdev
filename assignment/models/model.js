module.exports = function() {

    var mongoose = require("mongoose");
    var mongojs  = require('mongojs');

    mongoose.connect('mongodb://localhost/web-app-maker');
    mongojs('web-app-maker');

    var model = {
        developerModel   : require("./developer/developer.model.server")(),
        applicationModel : require("./application/application.model.server")(),
        shareModel       : require("./application/share.model.server")(applicationModel),
        pageModel        : require("./page/page.model.server")(applicationModel),
        widgetMode       : require("./widget/widget.model.server")(applicationModel),
        mongojs          : mongojs
    };
    return model;
}