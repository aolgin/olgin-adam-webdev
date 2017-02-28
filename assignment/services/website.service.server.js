module.exports = function(app) {
    app.get("/api/user/:uid/website", findWebsitesByUser);
    app.post("/api/user/:uid/website", createWebsite);
    app.get("/api/website/:wid", findWebsiteById);
    app.delete("/api/website/:wid", deleteWebsite);
    app.put("/api/website/:wid", updateWebsite);

    var websites = [
        {"_id": "123", "name": "Facebook", "developerId": "456", "description": "Lorem", "created": new Date()},
        {"_id": "234", "name": "Tweeter", "developerId": "456", "description": "Lorem", "created": new Date()},
        {"_id": "456", "name": "Gizmodo", "developerId": "456", "description": "Lorem", "created": new Date()},
        {"_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem", "created": new Date()},
        {"_id": "678", "name": "Checkers", "developerId": "123", "description": "Lorem", "created": new Date()},
        {"_id": "789", "name": "Chess", "developerId": "234", "description": "Lorem", "created": new Date()}
    ];

    // Helper Functions

    function findIndexById(wid) {
        var index = websites.findIndex(function(w) {
            return w._id === wid;
        });
        return index;
    }

    function findSiteByNameForUser(name, uid) {
        var site = websites.find(function(w) {
            // Site names are not case sensitive
            return w.developerId === uid &&
                w.name.toUpperCase() === name.toUpperCase();
        });
        return site;
    }

    // Service Functions

    function findWebsitesByUser(req, res) {
        var devId = req.params['uid'];
        var sites = websites.filter(function(w) {
            return w.developerId === devId;
        });
        res.json(sites);
    }

    function createWebsite(req, res) {
        var site = req.body;
        var uid = req.params['uid'];
        var siteExists = findSiteByNameForUser(uid, site.name);
        if (!siteExists) {
            var wid = String(new Date().getTime());
            var created = new Date();
            var newSite = {
                "_id": wid,
                "developerId": uid,
                "name": site.name,
                "description": site.description,
                "created": created,
                "modified": created
            };
            websites.push(newSite);
            res.sendStatus(200);
        } else {
            res.sendStatus(409);
        }
    }

    function findWebsiteById(req, res) {
        var wid = req.params['wid'];
        var site = websites.find(function(w) {
           return w._id === wid;
        });
        if (site) {
            res.json(site);
        } else {
            res.sendStatus(404);
        }
    }

    function updateWebsite(req, res) {
        var site = req.body;
        var modified = new Date();

        var index = findIndexById(req.params['wid']);
        if (site.name != websites[index].name &&
            findSiteByNameForUser(site.name, site.developerId)) {
            res.sendStatus(409);
            return;
        }
        websites[index].name = site.name;
        websites[index].description = site.description;
        websites[index].modified = modified;

        res.sendStatus(200);
    }

    function deleteWebsite(req, res) {
        var index = findIndexById(req.params['wid']);
        websites.splice(index, 1);
        res.sendStatus(200);
    }
};
