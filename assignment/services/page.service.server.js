module.exports = function(app) {
    app.get("/api/website/:wid/page", findPagesByWebsite);
    app.post("/api/website/:wid/page", createPage);
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
            return p._id === pid;
        });
        return index;
    }

    function findPageByName(name) {
        var page = pages.find(function(p) {
            // Page names are not case sensitive
            return p.name.toUpperCase() === name.toUpperCase();
        });
        return page;
    }

    // Service Functions

    function findPagesByWebsite(req, res) {
        var wid = req.params['wid'];
        var pps = pages.filter(function(p) {
            return p.websiteId === wid;
        });
        res.json(pps);
    }

    function createPage(req, res) {
        var page = req.body;
        var pageExists = findPageByName(page.name);
        if (!pageExists) {
            var pid = String(new Date().getTime());
            var created = new Date();
            var newPage = {
                "_id": pid,
                "websiteId": req.params['wid'],
                "name": page.name,
                "description": page.description,
                "created": created,
                "modified": created
            };
            pages.push(newPage);
            res.sendStatus(200);
        } else {
            res.sendStatus(409);
        }
    }

    function findPageById(req, res) {
        var pid = req.params['pid'];
        var page = pages.find(function(p) {
            return p._id === pid;
        });
        if (page) {
            res.json(page);
        } else {
            res.sendStatus(404);
        }
    }

    function updatePage(req, res) {
        var page = req.body;
        var modified = new Date();

        var index = findIndexById(req.params['pid']);
        if (page.name != pages[index].name &&
            findPageByName(page.name)) {
            res.sendStatus(409);
            return;
        }

        pages[index].name = page.name;
        pages[index].description = page.description;
        pages[index].modified = modified;

        res.sendStatus(200);
    }

    function deletePage(req, res) {
        var index = findIndexById(req.params['pid']);
        pages.splice(index, 1);
        res.sendStatus(200);
    }

};