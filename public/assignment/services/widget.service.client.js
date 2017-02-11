(function() {
    angular
        .module("WebAppMaker")
        .factory('WidgetService', widgetService);

    function widgetService() {

        var widgets = [
            { "_id": "123", "name": "Gizmodo Heading", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
            { "_id": "234", "name": "Lorem Heading1", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "345", "name": "Random Image", "text": "lorem", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "http://lorempixel.com/400/200/"},
            { "_id": "456", "name": "RawHTML1", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
            { "_id": "567", "name": "Lorem Heading2", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "678", "name": "Youtube Widget1", "text": "lorem", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://www.youtube.com/AM2Ivdi9c4E" },
            { "_id": "789", "name": "RawHTML2", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
        ];

        var api = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget
        };
        return api;

        function createWidget(pageId, type) {
            var newWidget = {
                "_id": String(new Date().getTime()),
                "pageId": pageId,
                "widgetType": type
            };
            widgets.push(newWidget);
            return newWidget._id;
        }

        function findWidgetsByPageId(pageId) {
            var widgetList = [];
            for (var w in widgets) {
                if (widgets[w].pageId === pageId) {
                    widgetList.push(widgets[w]);
                }
            }
            return widgetList;
        }

        function findWidgetById(widgetId) {
            for (var w in widgets) {
                if (widgets[w]._id === widgetId) {
                    return angular.copy(widgets[w]);
                }
            }
            return null;
        }

        function updateWidget(widgetId, newWidget) {
            for (var w in widgets) {
                if (widgets[w]._id === widgetId) {
                    //TODO determine how best to handle this
                    return 0;
                }
            }
            return 1;
        }

        function deleteWidget(widgetId) {
            for (var w in widgets) {
                if (widgets[w]._id === widgetId) {
                    widgets.splice(w, 1);
                }
            }
        }
    }
})();