module.exports = function(app) {
    // var model = require("./models/model.js")();
    //
    var userModel = require("./models/user/user.model.server");

    require("./services/user.service.server.js")(app, userModel);
    require("./services/website.service.server.js")(app);
    require("./services/page.service.server.js")(app);
    require("./services/widget.service.server.js")(app);
};