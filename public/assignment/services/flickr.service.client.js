(function() {
    angular
        .module("WebAppMaker")
        .factory('FlickrService', flickrService);

    function flickrService($http) {
        var key = process.env.FLICKR_API_KEY;
        var secret = process.env.FLICKR_SECRET;
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

        var api = {
            "searchPhotos": searchPhotos
        };

        function searchPhotos(searchTerm) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();