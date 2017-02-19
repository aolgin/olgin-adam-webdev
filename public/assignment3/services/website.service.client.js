(function(){
    angular
        .module("WebAppMaker")
        .factory('WebsiteService', websiteService);

    function websiteService() {

        var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem", "created": new Date() },
            { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem", "created": new Date() },
            { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem", "created": new Date() },
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem", "created": new Date() },
            { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem", "created": new Date() },
            { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem", "created": new Date() }
        ];

        var api = {
            "findWebsitesByUser": findWebsitesByUser,
            "createWebsite": createWebsite,
            "deleteWebsite": deleteWebsite,
            "updateWebsite": updateWebsite,
            "findWebsiteById": findWebsiteById
        };
        return api;

        function findWebsiteById(wid) {
            for (var w in websites) {
                if (websites[w]._id === wid) {
                    return angular.copy(websites[w]);
                }
            }
            return null;
        }

        function findWebsitesByUser(userId) {
            var sites = [];
            for (var w in websites) {
                if (websites[w].developerId === userId) {
                    sites.push(websites[w]);
                }
            }
            return sites;
        }

        function createWebsite(website, userId) {
            website.developerId = userId;
            website._id = String(new Date().getTime());
            website.created = new Date();
            websites.push(website);
        }

        function deleteWebsite(wid) {
            for (var w in websites) {
                if (websites[w]._id === wid) {
                    websites.splice(w, 1);
                }
            }
        }

        function updateWebsite(wid, newSite) {
            for (var w in websites) {
                if (websites[w]._id === wid) {
                    websites[w].name = newSite.name;
                    websites[w].description = newSite.description;
                }
            }
            return null;
        }
    }
})();