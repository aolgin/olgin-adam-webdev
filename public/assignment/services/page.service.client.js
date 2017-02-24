(function() {
    angular
        .module("WebAppMaker")
        .factory('PageService', pageService);


    function pageService($http) {

        var api = {
            "findPagesByWebsiteId": findPagesByWebsiteId,
            "createPage": createPage,
            "deletePage": deletePage,
            "updatePage": updatePage,
            "findPageById": findPageById
        };
        return api;

        function findPageById(pid) {
            return $http.get("/api/page/" + pid);
        }

        function findPagesByWebsiteId(wid) {
            return $http.get("/api/website/" + wid + "/page");
        }

        function createPage(page, wid) {
            return $http.post("/api/website/" + wid + "/page", page);
        }

        function deletePage(pid) {
            return $http.delete("/api/page/" + pid);
        }

        function updatePage(pid, newPage) {
            return $http.put("/api/page/" + pid, newPage);
        }
    }
})();