(function() {
    angular
        .module("WebAppMaker")
        .factory('PageService', pageService);


    function pageService() {

        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
            { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
            { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
        ]

        var api = {
            "findAllPagesForWebsite": findAllPagesForWebsite,
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

        function findAllPagesForWebsite(wid) {
            var pps = [];
            for (var p in pages) {
                if (pages[p].websiteId === wid) {
                    pps.push(pages[p]);
                }
            }
            return pps;
        }

        function createPage(page, userId) {
            page.developerId = userId;
            page._id = (new Date().getTime());
            page.created = new Date();
            pages.push(page);
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
                    pages[p].description =newPage.description;
                }
            }
        }
    }
})();