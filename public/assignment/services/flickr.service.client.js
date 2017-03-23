(function() {
    angular
        .module("WebAppMaker")
        .factory('FlickrService', flickrService);

    function flickrService($http) {

        var urlBase = "https://api.flickr.com/services/rest/" +
            "?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT&per_page=50&page=PAGENUM";

        // Albeit very bad practice, I will need to temporarily include this in here for now so that I can
        // properly direct focus onto the other parts of this assignment. I will return to attempting to get it working
        // by sending a request to the server for the key instead.
        var key = 'e729faccc241a08b58b0a6d507a07aef';

        var api = {
            "getFlickrApi": getFlickrApi,
            "searchPhotos": searchPhotos
        };
        return api;

        function getFlickrApi() {
            return $http.get("/api/widget/flickr");
        }

        function searchPhotos(searchTerm, pageNum) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm).replace("PAGENUM", String(pageNum));
            return $http.get(url);
            // var promise = getFlickrApi();
            // promise.then(
            //     function(response) {
            //         var key = response.data;
            //         var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm).replace("PAGENUM", String(pageNum));
            //         return $http.get(url);
            //     }
            // ).catch(function(err) {
            //     console.log(err);
            // });
        }
    }
})();