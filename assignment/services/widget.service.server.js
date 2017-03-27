module.exports = function (app) {

    var widgetModel = model.widgetModel;
    // Additional Widget Dependencies
    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var fs = require('fs');
    var _ = require('underscore');

    app.get("/api/page/:pid/widget", findWidgetsByPageId);
    app.post("/api/page/:pid/widget", createWidget);
    app.put("/api/page/:pid/widget", reorderWidget);
    app.get("/api/widget/flickr", getFlickrApi);
    app.get("/api/widget/:wgid", findWidgetById);
    app.delete("/api/widget/:wgid", deleteWidget);
    app.put("/api/widget/:wgid", updateWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.delete("/api/upload/:img", deleteImage);

    // Helper Functions

    // TODO potentially irrelevant function now. Determine whether to remove
    function findIndexById(wgid) {
        widgetModel.findIndexById(wgid)
            .then(function(index) {
                if (index) {
                    return index;
                } else {
                    return -1;
                }
            }, function (err) {
                console.log(err);
                return -2;
            });
    }

    // NOT CURRENTLY IN USE
    function findWidgetByName(name) {
        widgetModel.findWidgetByName(name)
            .then(function(widget) {
                    if (widget) {
                        return widget;
                    } else {
                        return null;
                    }
                }, function (err) {
                    console.log(err);
                });
    }

    function numWidgetsByPage(pid) {
        widgetModel.numWidgetsByPage(pid)
            .then(function(count) {
                if (count) {
                    return count;
                } else {
                    return -1;
                }
            }, function (err) {
                console.log(err);
                return -2;
            });
    }

    // Additional Widget Functionality

    /*var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../../public/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]))
        }
    });

    var upload = multer({ //multer settings
        storage: storage
    }).single('file');*/

    // Service Functions

    function reorderWidget(req, res) {
        var pid = req.params['pid'];
        var start = req.query['startIndex'];
        var end = req.query['endIndex'];
        widgetModel.reorderWidget(pid, start, end)
            .then(function (status) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function getFlickrApi(req, res) {
        var key = process.env.FLICKR_API_KEY;
        res.send(key);
    }

/*    function uploadImage(req, res) {
        upload(req, res, function(err){
            if(err){
                res.json({error_code:1,err_desc:err});
                return;
            }
            res.json({error_code:0,err_desc:null});
        });
        app.listen('3000', function(){
            console.log('running on 3000...');
        });
    }*/

    // TO RETURN TO
    // TODO: As it currently stands, this is will be broken by the move to a database
    function uploadImage(req, res) {
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;
        var name = req.body.name;
        var text = req.body.text;

        var filename      = myFile.filename;     // new file name in upload folder
        /*
        Various other file properties that can be used
         var originalname  = myFile.originalname; // file name on user's computer
         var path          = myFile.path;         // full path of uploaded file
         var destination   = myFile.destination;  // folder where file is saved to
         var size          = myFile.size;
         var mimetype      = myFile.mimetype;
         */

        var index = findIndexById(widgetId);
        widgets[index].url = '/uploads/' + filename;
        widgets[index].name = name;
        widgets[index].text = text;
        widgets[index].width = width;
        var callbackUrl   = "/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId;

        res.redirect(callbackUrl);
    }

    // TODO: NOT YET IMPLEMENTED
    function deleteImage(req, res) {
        var filename = req.params['img'];
        var path = "../../public/uploads/" + filename;
        fs.unlinkSync(path);
        res.sendStatus(200);
    }

    function findWidgetsByPageId(req, res) {
        var pid = req.params['pid'];

        model.pageModel.findWidgetsForPage(pid)
            .then(function (response) {
                var sortedByOrder = _.sortBy(response.widgets, 'orderIndex');
                res.json(sortedByOrder);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function createWidget(req, res) {

        var pid = req.params['pid'];
        var widget = req.body;

        widgetModel.numWidgetsByPage(pid)
            .then(function (results) {
                widget.orderIndex = results;

                widgetModel.createWidget(pid, widget)
                    .then(function (response) {
                        res.sendStatus(200);
                    }, function (err) {
                        console.log(err);
                        res.sendStatus(500);
                    })
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function findWidgetById(req, res) {

        var wgid = req.params['wgid'];

        widgetModel
            .findWidgetById(wgid)
            .then(function (widget) {
                if (widget) {
                    res.json(widget);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function updateWidget(req, res) {

        var newWidget = req.body;
        var wgid = req.params['wgid'];

        widgetModel.updateWidget(wgid, newWidget)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function deleteWidget(req, res) {

        var wgid = req.params['wgid'];
        widgetModel
            .removeWidget(wgid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }


};