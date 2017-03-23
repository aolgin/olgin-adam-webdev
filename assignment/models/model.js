module.exports = function() {

    var mongoose = require('mongoose');
    var mongojs  = require('mongojs');

    mongoose.Promise = require('q').Promise;

    var connectionString = 'mongodb://localhost/web-app-maker';
    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }
    mongoose.connect(connectionString);
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

    model.userModel.setModel(model);
    model.websiteModel.setModel(model);
    model.pageModel.setModel(model);
    model.widgetModel.setModel(model);

    return model;
};