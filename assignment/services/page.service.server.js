module.exports = function(app, model) {
    var pageModel = model.pageModel;

    app.get("/api/website/:wid/page", findPagesByWebsite);
    app.post("/api/website/:wid/page", createPage);
    app.get("/api/page/:pid", findPageById);
    app.delete("/api/page/:pid", deletePage);
    app.put("/api/page/:pid", updatePage);

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

        model.websiteModel.findPagesForWebsite(wid)
            .then(function (response) {
                res.json(response.pages);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }


    function createPage(req, res) {
        var newPage = req.body;
        var wid = req.params['wid'];

        pageModel.createPage(wid, newPage)
            .then(function (page) {
                res.json(page);
            }, function (err) {
                console.log(err);
                res.sendStatus(409);
            });
    }

    function findPageById(req, res) {
        var pid = req.params['pid'];
        pageModel
            .findPageById(pid)
            .then(function (page) {
                res.json(page);
            }, function (err) {
                console.log(err);
                res.sendStatus(404);
            });
    }

    function updatePage(req, res) {
        var page = req.body;
        var pid = req.params['pid'];
        page.dateModified = new Date();

        pageModel.updatePage(pid, page)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(409);
            });
    }

    function deletePage(req, res) {
        var pid = req.params['pid'];

        pageModel
            .removePage(pid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }

};