(function(){
    angular
        .module("WebAppMaker")
        .factory('WebsiteService', websiteService);

    function websiteService($http) {

        var api = {
            "findWebsitesByUser": findWebsitesByUser,
            "createWebsite": createWebsite,
            "deleteWebsite": deleteWebsite,
            "updateWebsite": updateWebsite,
            "findWebsiteById": findWebsiteById
        };
        return api;

        function findWebsiteById(wid) {
            return $http.get("/api/website/" + wid);
        }

        function findWebsitesByUser(uid) {
            return $http.get("/api/user/" + uid + "/website");
        }

        function createWebsite(website, uid) {
            return $http.post("/api/user/" + uid + "/website", website);
        }

        function deleteWebsite(wid) {
            return $http.delete("/api/website/" + wid);
        }

        function updateWebsite(wid, newSite) {
            return $http.put("/api/website/" + wid, newSite);
        }
    }
})();