module.exports = function (app) {

    var widgetModel = model.widgetModel;
    // Additional Widget Dependencies
    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var fs = require('fs');

    app.get("/api/page/:pid/widget", findWidgetsByPageId);
    app.post("/api/page/:pid/widget", createWidget);
    app.delete("/api/page/:pid/widget", cleanupEmptyWidgets);
    app.put("/api/page/:pid/widget", reorderWidget);
    app.get("/api/widget/flickr", getFlickrApi);
    app.get("/api/widget/:wgid", findWidgetById);
    app.delete("/api/widget/:wgid", deleteWidget);
    app.put("/api/widget/:wgid", updateWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.delete("/api/upload/:img", deleteImage);

    var widgets = [
        { "_id": "123", "name": "Gizmodo Heading", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO", "orderIndex": 0},
        { "_id": "234", "name": "Lorem Heading1", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum", "orderIndex": 1},
        { "_id": "345", "name": "Random Image", "text": "lorem", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/", "orderIndex": 2},
        { "_id": "456", "name": "RawHTML1", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>", "orderIndex": 3},
        { "_id": "567", "name": "Lorem Heading2", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum", "orderIndex": 4},
        { "_id": "678", "name": "Youtube Widget1", "text": "lorem", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://www.youtube.com/AM2Ivdi9c4E", "orderIndex": 5 },
        { "_id": "789", "name": "RawHTML2", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>", "orderIndex": 6},
        { "_id": "6121", "name": "Gizmodo Heading5", "widgetType": "HEADING", "pageId": "58d07b96127bc3526c90a81b", "size": 3, "text": "UIO", "orderIndex": 0},
        { "_id": "7651", "name": "Gizmodo Heading6", "widgetType": "HEADING", "pageId": "58d07b96127bc3526c90a81b", "size": 2, "text": "GIZMODAI", "orderIndex": 1},
        { "_id": "8765", "name": "Gizmodo Heading2", "widgetType": "HEADING", "pageId": "58d07b96127bc3526c90a81b", "size": 2, "text": "GIZMODO", "orderIndex": 2}
    ];

    // Helper Functions

    // MongoDB widget creation calls
    //
    // db.widget.insert({"widgetType": "HEADING", "orderIndex": 0, "justCreated": false, "name": "Sample Heading", "size": 2, "text": "Sample Heading Text", _page: ObjectId("58d3109396d73745b8a3f765")})
    // db.widget.insert({"widgetType": "IMAGE", "orderIndex": 2, "justCreated": false, "name": "Sample Image", "text": "Sample Image Text", "url": "https://static.pexels.com/photos/7720/night-animal-dog-pet.jpg", "width": "100%", _page: ObjectId("58d3109396d73745b8a3f765")})
    // db.widget.insert({"widgetType": "HTML", "orderIndex": 1, "justCreated": false, "name": "Sample HTML", "text": "<p>Here is some sample HTML</p>", _page: ObjectId("58d3109396d73745b8a3f765")})
    // db.page.update({_id: ObjectId("58d3109396d73745b8a3f765")}, {$push: { widgets: {$each: [ObjectId("58d310e1979785c359cb4813"), ObjectId("58d310f5979785c359cb4814"), ObjectId("58d310ff979785c359cb4815")]}}})

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
        var key = process.env.FLICKR_API_KEY || 'e729faccc241a08b58b0a6d507a07aef';
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

    //TODO: Need to stop doing this and just make widgets properly
    // However, this will take care of cases where the user goes to make a new widget
    // and then hits 'back'
    function cleanupEmptyWidgets(req, res) {
        var pid = req.params['pid'];
        var wgs = widgets.filter(function(w) {
            return w.pageId === pid &&
                w.newWidget === true;
        });
        for (var w in wgs) {
            var index = findIndexById(w._id);
            widgets.splice(index, 1);
        }
        res.sendStatus(200);
    }

    function findWidgetsByPageId(req, res) {
        var pid = req.params['pid'];

        model.pageModel.findWidgetsForPage(pid)
            .then(function (response) {
                res.json(response.widgets);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function createWidget(req, res) {
        // var pid = req.params['pid'];
        // var wgid = String(new Date().getTime());
        // var created = new Date();
        // var orderIndex = numWidgetsByPage(pid); // Set as the last widget on the page by default
        // var newWidget = {
        //     "_id": wgid,
        //     "pageId": pid,
        //     "name": "",
        //     "widgetType": req.query['widgetType'],
        //     "orderIndex": orderIndex,
        //     "new": true
        // };
        // widgets.push(newWidget);
        // res.send(wgid);

        var pid = req.params['pid'];

        widgetModel.numWidgetsByPage(pid)
            .then(function (count) {
                var newWidget = {
                    "widgetType": req.query['widgetType'],
                    "orderIndex": count
                };

                widgetModel.createWidget(pid, newWidget)
                    .then(function (widget) {
                        res.json(widget);
                    }, function (err) {
                        console.log(err);
                        res.sendStatus(500);
                    })
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });



        // widgetModel.createWidget(pid, newWidget)
        //     .then(function (response) {
        //         console.log(response);
        //         res.send(response);
        //     }, function (err) {
        //         console.log(err);
        //         res.sendStatus(500);
        //     });
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
            })
    }


};