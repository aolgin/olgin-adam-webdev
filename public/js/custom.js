// TODO: Make draggable widgets work. Don't use this file yet!
function rearrangeableWidgetList() {
    $("ado-widget").draggable();
    $("ul").sortable({axis: y});
}

$(rearrangeableWidgetList);