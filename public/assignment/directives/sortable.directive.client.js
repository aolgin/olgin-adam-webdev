(function () {
    angular
        .module('WebAppMaker')
        .directive('adoSortable', sortableDir);



    function sortableDir($location, $http, WidgetService) {
        function getPageId() {
            var url = $location.path();
            var pattern = RegExp("([A-Za-z0-9]+)\/widget");
            var found = url.match(pattern);
            return found[1];
        }
        function linkFunc(scope, element, attributes) {
            var pid = getPageId();
            element.sortable({
                axis: 'y',
                scroll: false,
                opacity: 0.5,
                containment: "parent",
                start: function(event, ui) {
                    startIndex = ui.item.index();
                },
                stop: function(event, ui) {
                    endIndex = ui.item.index();
                    if (startIndex != endIndex) {
                        WidgetService.reorderWidget(pid, startIndex, endIndex);
                    }
                }
            });
        }
        return {
            link: linkFunc
        };
    }
})();