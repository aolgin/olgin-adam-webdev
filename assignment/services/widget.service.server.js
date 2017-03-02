module.exports = function (app) {
    // Additional Widget Dependencies
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var fs = require('fs');
    var randomstring = require('randomstring');

    app.get("/api/page/:pid/widget", findWidgetsByPage);
    app.post("/api/page/:pid/widget", createWidget);
    app.delete("/api/page/:pid/widget", cleanupEmptyWidgets);
    app.get("/api/widget/:wgid", findWidgetById);
    app.delete("/api/widget/:wgid", deleteWidget);
    app.put("/api/widget/:wgid", updateWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.delete("/api/upload/:img", deleteImage);
    // app.put("/api/page/:pid/widget", updateWidgetOrdering);

    var widgets = [
        { "_id": "123", "name": "Gizmodo Heading", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO", "orderIndex": 0},
        { "_id": "234", "name": "Lorem Heading1", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum", "orderIndex": 1},
        { "_id": "345", "name": "Random Image", "text": "lorem", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/", "orderIndex": 2},
        { "_id": "456", "name": "RawHTML1", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>", "orderIndex": 3},
        { "_id": "567", "name": "Lorem Heading2", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum", "orderIndex": 4},
        { "_id": "678", "name": "Youtube Widget1", "text": "lorem", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://www.youtube.com/AM2Ivdi9c4E", "orderIndex": 5 },
        { "_id": "789", "name": "RawHTML2", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>", "orderIndex": 6}
    ];

    // Helper Functions

    function findIndexById(wgid) {
        var index = widgets.findIndex(function(w) {
            return w._id === wgid;
        });
        return index;
    }

    function findWidgetByName(name) {
        var widget = widgets.find(function(w) {
            // Widget names are not case sensitive
            return w.name.toUpperCase() === name.toUpperCase();
        });
        return widget;
    }

    function numWidgetsByPage(pid) {
        var widgetList = widgets.filter(function(w) {
            return w.pageId === pid;
        });
        return widgetList.length;
    }

    // Currently unused. Was put into place before realizing multer already randomly generated a name
    function randomName(strlen) {
        // strlen is an optional argument. If unspecified, use 16 for the default len
        strlen = strlen == null ? 16 : strlen;
        return randomstring.generate(strlen);
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

/*    function updateWidgetOrdering(req, res) {
        var pid = req.params['pid'];
        var newOrder = req.body;
    }*/

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

    // NOT YET IMPLEMENTED
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
                w.new === true;
        });
        for (var w in wgs) {
            var index = findIndexById(w._id);
            widgets.splice(index, 1);
        }
        res.sendStatus(200);
    }

    function findWidgetsByPage(req, res) {
        var pid = req.params['pid'];
        var wgs = widgets.filter(function(w) {
            return w.pageId === pid;
        });
        res.json(wgs);
    }

    function createWidget(req, res) {
        var pid = req.params['pid'];
        var wgid = String(new Date().getTime());
        var created = new Date();
        var orderIndex = numWidgetsByPage(pid); // Set as the last widget on the page by default
        var newWidget = {
            "_id": wgid,
            "pageId": pid,
            "name": "",
            "widgetType": req.query['widgetType'],
            "created": created,
            "modified": created,
            "orderIndex": orderIndex,
            "new": true
        };
        widgets.push(newWidget);
        res.send(wgid);
    }

    function findWidgetById(req, res) {
        var wgid = req.params['wgid'];
        var widget = widgets.find(function(w) {
            return w._id === wgid;
        });
        if (widget) {
            res.json(widget);
        } else {
            res.sendStatus(404); // Not Found
        }
    }

    function updateWidget(req, res) {
        var widget = req.body;
        var type = widget.widgetType;
        var modified = new Date();

        if (!widget.name) {
            res.sendStatus(400); // Bad Request
            return;
        }

        var index = findIndexById(req.params['wgid']);
        if (widget.name != widgets[index].name &&
            findWidgetByName(widget.name)) {
            res.sendStatus(409); // Conflict
            return;
        }
        widgets[index].name = widget.name;
        widgets[index].text = widget.text;
        widgets[index].modified = modified;
        widgets[index].new = false;

        if (type === 'YOUTUBE' || type === 'IMAGE') {
            widgets[index].url = widget.url;
            widgets[index].width = widget.width;
        } else if (type === 'HEADING') {
            widgets[index].size = widget.size;
        }

        res.sendStatus(200);
    }

    function deleteWidget(req, res) {
        var index = findIndexById(req.params['wgid']);
        widgets.splice(index, 1);
        res.sendStatus(200);
    }


};