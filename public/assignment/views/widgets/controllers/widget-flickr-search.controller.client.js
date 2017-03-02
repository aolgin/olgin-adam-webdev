(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetFlickrSearchController", WidgetFlickrSearchController);

    function WidgetFlickrSearchController(WidgetService, FlickrService) {
        vm.searchPhotos = function(searchTerm) {
            FlickrService
                .searchPhotos(searchTerm)
                .then(function(response) {
                    data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }
    }
})();