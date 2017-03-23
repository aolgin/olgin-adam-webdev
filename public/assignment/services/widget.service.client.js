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
            "cleanupEmptyWidgets": cleanupEmptyWidgets
        };
        return api;

        function cleanupEmptyWidgets(pid) {
            return $http.delete("/api/page/" + pid + "/widget");
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

        function createWidget(pageId, type) {
            return $http.post("/api/page/" + pageId + "/widget?widgetType=" + type);
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