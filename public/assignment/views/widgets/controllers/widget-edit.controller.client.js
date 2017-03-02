(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetEditController", WidgetEditController);

    function WidgetEditController($routeParams, $location, $sce, WidgetService) { //FlickrService
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.widgetId = $routeParams['wgid'];
        vm.imageEditorType = "url";

        function init() {
            var promise = WidgetService.findWidgetById(vm.widgetId);
            promise.then(function(response) {
               vm.widget = response.data;
            });
        }
        init();

        vm.changeImageEditorType = changeImageEditorType;
        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.trustUrl = trustUrl;
        vm.getTrustedHtml = getTrustedHtml;
        // vm.searchFlickr = searchFlickr;
        // vm.selectFlickrPhoto = selectFlickrPhoto;
        // vm.submit = submit;
        // vm.uploadImage = uploadImage;

        function changeImageEditorType(type) {
            vm.imageEditorType = type;
        }

        // function searchFlickr(txt) {
        //     FlickrService
        //         .searchPhotos(txt)
        //         .then(function(response) {
        //             data = response.data.replace("jsonFlickrApi(","");
        //             data = data.substring(0,data.length - 1);
        //             data = JSON.parse(data);
        //             vm.photos = data.photos;
        //         });
        // }
        //
        // function selectFlickrPhoto(photo) {
        //     var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
        //     url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
        //     // var promise = WidgetService.updateWidget(websiteId, pageId, widgetId, {url: url})
        //     //     .then(...);
        // }

        // vm.submit = function(){ //function to call on form submit
        //     if (vm.upload_form.file.$valid &amp;&amp; vm.file) { //check if from is valid
        //         vm.upload(vm.file); //call upload function
        //     }
        // };
        // vm.upload = function (file) {
        //     Upload.upload({
        //         url: '/api/upload', //webAPI exposed to upload the file
        //         data:{file:file} //pass file as data, should be user ng-model
        //     }).then(function (resp) { //upload function returns a promise
        //         if(resp.data.error_code === 0){ //validate success
        //             $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
        //         } else {
        //             $window.alert('an error occured');
        //         }
        //     }, function (resp) { //catch error
        //         console.log('Error status: ' + resp.status);
        //         $window.alert('Error status: ' + resp.status);
        //     }, function (evt) {
        //         console.log(evt);
        //         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //         console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        //         vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        //     });
        // };


        function trustUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getEditorTemplateUrl(type) {
            return 'views/widgets/templates/editors/widget-' + type + '-editor.view.client.html';
        }

        // NOT IN USE
        // function uploadImage(file) {
        //     console.log(file);
        //     var promise = WidgetService.uploadImage(vm.widgetId, file);
        //     promise.then(function (response) {
        //         if (response.status == 200) {
        //             vm.error = null;
        //             vm.message = "Image uploaded successfully!";
        //         }
        //     }).catch(function(err) {
        //         vm.message = null;
        //         vm.error = "An Error occurred trying to upload the image: " + err.data;
        //     });
        // }

        function deleteWidget() {
            var answer = confirm("Delete this widget?");
            if (answer) {
                var promise = WidgetService.deleteWidget(vm.widgetId);
                promise.then(function (response) {
                    if (response.status == 200) {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                    }
                }).catch(function(err) {
                    vm.error = "An error occurred trying to delete the widget: \n" + err.data;
                });
            }
        }

        function updateWidget(newWidget) {
            var promise = WidgetService.updateWidget(vm.widgetId, newWidget);
            promise.then(function(response) {
                if (response.status == 200) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                }
            }).catch(function (err) {
                var status = err.status;
                if (status == 409) {
                    vm.error = "A widgets exists with that name already! Please use a different name";
                } else if (status == 400) {
                    vm.error = "Name field is required";
                } else {
                    vm.error = "An error occurred trying to update the widget: \n" + err.data;
                }
            });
        }
    }
})();