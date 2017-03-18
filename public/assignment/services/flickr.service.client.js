(function() {
    angular
        .module("WebAppMaker")
        .factory('FlickrService', flickrService);

    function flickrService($http) {

        var key = 'e729faccc241a08b58b0a6d507a07aef'; //process.env.FLICKR_API_KEY ||
        var secret = 'cede3e81fc9c9efe'; //process.env.FLICKR_SECRET ||
        var urlBase = "https://api.flickr.com/services/rest/" +
            "?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT&per_page=50&page=PAGENUM";

        var api = {
            "searchPhotos": searchPhotos
        };
        return api;

        function searchPhotos(searchTerm, pageNum) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm).replace("PAGENUM", String(pageNum));
            return $http.get(url);
        }
    }
})();