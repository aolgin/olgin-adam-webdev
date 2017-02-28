(function () {
    angular
        .module('WebAppMaker')
        .directive('adoSortable', sortableDir);

    function sortableDir() {
        function linkFunc(scope, element, attributes) {
            element.sortable({
                axis: 'y',
                scroll: false,
                opacity: 0.5,
                containment: "parent"
                /*start: function(event, ui) {
                    startIndex = ui.item.index();
                },
                stop: function(event, ui) {
                    endIndex = ui.item.index();
                    console.log([startIndex, endIndex]);
                }*/
            });
        }
        return {
            link: linkFunc
        };
    }
})();