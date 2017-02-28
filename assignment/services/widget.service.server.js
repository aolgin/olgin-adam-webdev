module.exports = function (app) {
    app.get("/api/page/:pid/widget", findWidgetsByPage);
    app.post("/api/page/:pid/widget", createWidget);
    app.get("/api/widget/:wgid", findWidgetById);
    app.delete("/api/widget/:wgid", deleteWidget);
    app.put("/api/widget/:wgid", updateWidget);
    app.post("/api/upload", uploadImage);
    // app.put("/api/page/:pid/widget", updateWidgetOrdering);

    // Additional Widget Dependencies
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var randomstring = require('randomstring');

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

    function randomName() {
        return randomstring.generate(16);
    }

    // Additional Widget Functionality

    // Service Functions

/*    function updateWidgetOrdering(req, res) {
        var pid = req.params['pid'];
        var newOrder = req.body;
    }*/

    function uploadImage(req, res) {


        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = randomName();     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = upload;         // folder where file is saved to
        var size          = myFile.size; //TODO what format does this come in as?
        var mimetype      = myFile.mimetype;

        var url = destination + filename;

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
            "orderIndex": orderIndex
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