module.exports = function() {

    var mongoose = require('mongoose');
    var mongojs  = require('mongojs');

    mongoose.connect('mongodb://localhost/web-app-maker');
    mongojs('web-app-maker');

    var userModel = require("./user/user.model.server")();
    var websiteModel = require("./website/website.model.server")();
    var pageModel = require("./page/page.model.server")();
    var widgetModel = require("./widget/widget.model.server")();

    var model = {
        userModel: userModel,
        websiteModel: websiteModel,
        pageModel: pageModel,
        widgetModel: widgetModel,
        mongojs: mongojs
    };

    userModel.setModel(model);
    websiteModel.setModel(model);
    pageModel.setModel(model);
    widgetModel.setModel(model);

    return model;

    //
    // var model = {
    //     userModel        : require("./user/user.model.server")(),
    //     websiteModel     : require("./website/website.model.server")(),
    //     pageModel        : require("./page/page.model.server")(),
    //     widgetModel      : require("./widget/widget.model.server")(),
    //     mongojs          : mongojs
    // };
    //
    // model.userModel.setModel(model);
    // model.websiteModel.setModel(model);
    // model.pageModel.setModel(model);
    // model.widgetModel.setModel(model);

    return model;
};