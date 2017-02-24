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
            "deleteWidget": deleteWidget
            // "updateWidgetOrdering": updateWidgetOrdering
        };
        return api;


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

        /*function updateWidgetOrdering(pid, widgetOrder) {
            return $http.put("/api/page/" + pid + "/widget", widgetOrder);
        }*/
    }
})();