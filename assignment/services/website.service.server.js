module.exports = function(app, model) {
    var websiteModel = model.websiteModel;

    app.get("/api/user/:uid/website", findWebsitesByUser);
    app.post("/api/user/:uid/website", createWebsite);
    app.get("/api/website/:wid", findWebsiteById);
    app.delete("/api/website/:wid", deleteWebsite);
    app.put("/api/website/:wid", updateWebsite);


    // Helper Functions

    // function findSiteByNameForUser(name, uid) {
    //     var site = websites.find(function(w) {
    //         // Site names are not case sensitive
    //         return w.developerId === uid &&
    //             w.name.toUpperCase() === name.toUpperCase();
    //     });
    //     return site;
    // }

    // Service Functions

    function findWebsitesByUser(req, res) {
        var devId = req.params['uid'];

        model.userModel.findWebsitesForUser(devId)
            .then(function (response) {
                res.json(response.websites);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }

    function createWebsite(req, res) {
        var site = req.body;
        var uid = req.params['uid'];

        websiteModel.createWebsite(uid, site)
            .then(function (site) {
                res.json(site);
            }, function (err) {
                console.log(err);
                res.sendStatus(409);
            });
    }

    function findWebsiteById(req, res) {
        var wid = req.params['wid'];

        websiteModel
            .findWebsiteById(wid)
            .then(function (site) {
                res.json(site);
            }, function (err) {
                console.log(err);
                res.sendStatus(404);
            });
    }

    function updateWebsite(req, res) {
        var newSite = req.body;
        var wid = req.params['wid'];
        newSite.dateModified = new Date();

        websiteModel.updateWebsite(wid, newSite)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(409);
            });
    }

    function deleteWebsite(req, res) {
        var wid = req.params['wid'];

        websiteModel
            .removeWebsite(wid)
            .then(function (response) {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.sendStatus(500);
            })
    }
};
