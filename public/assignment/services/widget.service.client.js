(function() {
    angular
        .module("WebAppMaker")
        .factory('WidgetService', widgetService);

    function widgetService() {

        var widgets = [
            { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
            { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "http://lorempixel.com/400/200/"},
            { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
            { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://youtu.be/AM2Ivdi9c4E" },
            { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
        ]

        var api = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget
        };
        return api;

        function createWidget(pageId, newWidget) {
            newWidget._id = new Date().getTime();
            newWidget.pageId = pageId;
            widgets.push(newWidget);
        }

        function findWidgetsByPageId(pageId) {
            var widgetList = [];
            for (var widgets in widgets) {
                if (widgets[w].pageId === pageId) {
                    widgetList.push(widgets[w]);
                }
            }
            return widgetList;
        }

        function findWidgetById(widgetId) {
            for (var widgets in widgets) {
                if (widgets[w]._id === widgetId) {
                    return angular.copy(widgets[w]);
                }
            }
            return null;
        }

        function updateWidget(widgetId, newWidget) {
            for (var widgets in widgets) {
                if (widgets[w]._id === widgetId) {
                    //TODO determine how best to handle this
                    return 0;
                }
            }
            return 1;
        }

        function deleteWidget(widgetId) {
            for (var widgets in widgets) {
                if (widgets[w]._id === widgetId) {
                    widgets.splice(w, 1);
                }
            }
        }
    }
})();