(function() {
    angular
        .module("WebAppMaker")
        .factory('WidgetService', widgetService);

    function widgetService($http) {

        var api = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget,
            // "uploadImage": uploadImage,
            "reorderWidget": reorderWidget
        };
        return api;

        function reorderWidget(pid, startIndex, endIndex) {
            var url = '/api/page/' + String(pid) +
                '/widget?startIndex=' + String(startIndex) +
                '&endIndex=' + String(endIndex);
            return $http.put(url);
        }

        // NOT IN USE
        // function uploadImage(wgid, file) {
        //     var fd = new FormData();
        //     fd.append('file', file);
        //
        //     return $http.post("/api/upload?wgid=" + wgid, fd, {
        //         transformRequest: angular.identity,
        //         headers: {'Content-Type': undefined}
        //     });
        //     // return $http.post("/api/upload?wgid=" + wgid, file)
        // }

        function createWidget(pageId, widget) {
            return $http.post("/api/page/" + pageId + "/widget", widget);
        }

        function findWidgetsByPageId(pageId) {
            return $http.get("/api/page/" + pageId + "/widget");
        }

        function findWidgetById(widgetId) {
            return $http.get("/api/widget/" + widgetId);
        }

        function updateWidget(widgetId, newWidget) {
            return $http.put("/api/widget/" + widgetId, newWidget);
        }

        function deleteWidget(widgetId) {
            return $http.delete("/api/widget/" + widgetId);
        }
    }
})();