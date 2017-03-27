(function() {
    angular
        .module("WebAppMaker")
        .factory('FlickrService', flickrService);

    function flickrService($http) {

        var urlBase = "https://api.flickr.com/services/rest/" +
            "?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT&per_page=50&page=PAGENUM";

        var api = {
            "getFlickrApi": getFlickrApi,
            "searchPhotos": searchPhotos
        };
        return api;

        function getFlickrApi() {
            return $http.get("/api/widget/flickr");
        }

        function searchPhotos(searchTerm, pageNum, key) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm).replace("PAGENUM", String(pageNum));
            return $http.get(url);
        }
    }
})();