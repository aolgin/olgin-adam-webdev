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
            var url = "/api/widget/" + widgetId +
                "?name=" + newWidget.name +
                "&text=" + newWidget.text;
            if (type === 'YOUTUBE' || type === 'IMAGE') {
                url += "&url=" + newWidget.url +
                        "&width=" + newWidget.width;
            } else if (type === 'HEADING') {
                url += "&size=" + newWidget.size;
            }
            return $http.put(url);
        }

        function deleteWidget(widgetId) {
            return $http.delete("/api/widget/" + widgetId);
        }
    }
})();