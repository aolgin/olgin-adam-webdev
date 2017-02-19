module.exports = function (app) {
    app.get("/api/page/:pid/widget", findWidgetsByPage);
    app.post("/api/page/:pid/widget", createWidget);
    app.get("/api/widget/:wgid", findWidgetById);
    app.delete("/api/widget/:wgid", deleteWidget);
    app.put("/api/widget/:wgid", updateWidget);

    var widgets = [
        { "_id": "123", "name": "Gizmodo Heading", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "name": "Lorem Heading1", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "name": "Random Image", "text": "lorem", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "name": "RawHTML1", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "name": "Lorem Heading2", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "name": "Youtube Widget1", "text": "lorem", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://www.youtube.com/AM2Ivdi9c4E" },
        { "_id": "789", "name": "RawHTML2", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];

    // Helper Functions

    function findIndexById(wgid) {
        var index = widgets.findIndex(function(w) {
            return w._id == wgid;
        });
        return index;
    }

    function findWidgetByName(name) {
        var widget = widgets.find(function(w) {
            return w.name == name;
        });
        return widget;
    }

    // Additional Widget Functionality

    /* var multer = require('multer'); // npm install multer --save
     var upload = multer({ dest: __dirname+'/../../public/uploads' });

     app.post ("/api/upload", upload.single('myFile'), uploadImage);

     function uploadImage(req, res) {

     var widgetId      = req.body.widgetId;
     var width         = req.body.width;
     var myFile        = req.file;

     var originalname  = myFile.originalname; // file name on user's computer
     var filename      = myFile.filename;     // new file name in upload folder
     var path          = myFile.path;         // full path of uploaded file
     var destination   = myFile.destination;  // folder where file is saved to
     var size          = myFile.size;
     var mimetype      = myFile.mimetype;
     }*/


    // Service Functions

    function findWidgetsByPage(res, req) {
        var wgid = req.params['wgid'];
        var wgs = widgets.filter(function(w) {
            return w.pageId == wgid;
        });
        res.json(wgs);
    }

    function createWidget(res, req) {
        var widgetExists = findWidgetByName(req.query['name']);
        if (!widgetExists) {
            var wgid = String(new Date().getTime());
            var created = new Date();
            var newWidget = {
                "_id": wgid,
                "pageId": req.params['pid'],
                "name": req.query['name'],
                "text": req.query['text'],
                "widgetType": req.query['type'],
                "created": created,
                "modified": created
            };
            widgets.push(newWidget);
            res.sendStatus(200);
        } else {
            //TODO verify whether this is what should be sent if user exists
            res.sendStatus(409)
        }
    }

    function findWidgetById(res, req) {
        var wgid = req.params['wgid'];
        var widget = widgets.find(function(w) {
            return w._id == wgid;
        });
        res.json(widget);
    }

    function updateWidget(res, req) {
        var name = req.query['name'];
        var text = req.query['text'];
        var type = req.query['type'];
        var modified = new Date();

        var index = findIndexById(req.params['wgid']);
        widgets[index].name = name;
        widgets[index].text = text;
        widgets[index].modified = modified;

        if (type === 'YOUTUBE' || type === 'IMAGE') {
            widgets[index].url = req.query['url'];
            widgets[index].width = req.query['width'];
        } else if (type === 'HEADING') {
            widgets[index].size = req.query['size'];
        }

        res.sendStatus(200);
    }

    function deleteWidget(res, req) {
        var index = findIndexById(req.params['wgid']);
        widgets.splice(index, 1);
        res.sendStatus(200);
    }


};