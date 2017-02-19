module.exports = function(app) {
    app.get("/api/website/:wid/page", findPagesByWebsite);
    app.post("/api/website/:pid/page", createPage);
    app.get("/api/page/:pid", findPageById);
    app.delete("/api/page/:pid", deletePage);
    app.put("/api/page/:pid", updatePage);

    var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
        { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
        { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
    ];

    // Helper Functions

    function findIndexById(pid) {
        var index = pages.findIndex(function(p) {
            return p._id == pid;
        });
        return index;
    }

    function findPageByName(name) {
        var page = pages.find(function(p) {
            return p.name == name;
        });
        return page;
    }

    // Service Functions

    function findPagesByWebsite(res, req) {
        var wid = req.params['wid'];
        var pps = pages.filter(function(p) {
            return p.websiteId == wid;
        });
        res.json(pps);
    }

    function createPage(res, req) {
        var pageExists = findPageByName(req.query['name']);
        if (!pageExists) {
            var pid = String(new Date().getTime());
            var created = new Date();
            var newPage = {
                "_id": pid,
                "websiteId": req.params['wid'],
                "name": req.query['name'],
                "description": req.query['description'],
                "created": created,
                "modified": created
            };
            pages.push(newPage);
            res.sendStatus(200);
        } else {
            //TODO verify whether this is what should be sent if user exists
            res.sendStatus(409)
        }
    }

    function findPageById(res, req) {
        var pid = req.params['pid'];
        var page = pages.find(function(p) {
            return p._id == pid;
        });
        res.json(page);
    }

    function updatePage(res, req) {
        var name = req.query['name'];
        var description = req.query['description'];
        var modified = new Date();

        var index = findIndexById(req.params['pid']);
        pages[index].name = name;
        pages[index].description = description;
        pages[index].modified = modified;

        res.sendStatus(200);
    }

    function deletePage(res, req) {
        var index = findIndexById(req.params['pid']);
        pages.splice(index, 1);
        res.sendStatus(200);
    }

};