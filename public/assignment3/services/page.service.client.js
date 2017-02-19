(function() {
    angular
        .module("WebAppMaker")
        .factory('PageService', pageService);


    function pageService() {

        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
            { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
            { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
        ];

        var api = {
            "findPagesByWebsiteId": findPagesByWebsiteId,
            "createPage": createPage,
            "deletePage": deletePage,
            "updatePage": updatePage,
            "findPageById": findPageById
        };
        return api;

        function findPageById(pid) {
            for (var p in pages) {
                if (pages[p]._id === pid) {
                    return angular.copy(pages[p]);
                }
            }
            return null;
        }

        function findPagesByWebsiteId(wid) {
            var pps = [];
            for (var p in pages) {
                if (pages[p].websiteId === wid) {
                    pps.push(pages[p]);
                }
            }
            return pps;
        }

        function createPage(page, websiteId) {
            var newPage = {
                "name": page.name,
                "description": page.title,
                "_id": String(new Date().getTime()),
                "websiteId": websiteId
            };
            pages.push(newPage);
        }

        function deletePage(pid) {
            for (var p in pages) {
                if (pages[p]._id === pid) {
                    pages.splice(p, 1);
                }
            }
        }

        function updatePage(pid, newPage) {
            for (var p in pages) {
                if (pages[p]._id === pid) {
                    pages[p].name = newPage.name;
                    pages[p].description = newPage.description;
                }
            }
        }
    }
})();