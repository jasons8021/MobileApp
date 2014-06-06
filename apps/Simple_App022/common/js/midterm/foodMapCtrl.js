app.controller('FoodMapCtrl', function($scope, RestaurantManager, Geolocation, $location, $window){
    $scope.address = {};
    $scope.address.hasAddress = false;
    $scope.restaurant = RestaurantManager.getRestaurant();
    var taipeiTech = new google.maps.LatLng(25.043022, 121.534248);
    var infowindow = new google.maps.InfoWindow();
    var currentLatLng;
    var geocoder;
    var marker;
    var map;
    var latlngFromMarker;

    function initialize() {
        Geolocation.getCurrentPosition(function(position) {
            console.log('gps work');
            currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var mapOptions = {
                zoom: 17,
                center: currentLatLng
            };

            geocoder = new google.maps.Geocoder();
            map = new google.maps.Map(document.getElementById('foodMap-canvas'), mapOptions);
            marker = new google.maps.Marker({
                map:map,
                draggable:true,
                animation: google.maps.Animation.DROP,
                position: currentLatLng
            });

            google.maps.event.addListener(marker, 'click', function(evt){
                codeLatLng(evt.latLng.lat(), evt.latLng.lng());
                console.log('address.hasAddress : ' + $scope.address.hasAddress)
            });

            google.maps.event.addListener(marker, 'dragstart', function(evt){
                $scope.address.hasAddress = false;
            });

            google.maps.event.addListener(marker, 'dragend', function(evt){
                codeLatLng(evt.latLng.lat(), evt.latLng.lng());
                console.log('address.hasAddress : ' + $scope.address.hasAddress)
            });
        }, function(error){
            var mapOptions = {
                zoom: 17,
                center: taipeiTech
            };
            
            geocoder = new google.maps.Geocoder();
            map = new google.maps.Map(document.getElementById('foodMap-canvas'), mapOptions);
            marker = new google.maps.Marker({
                map:map,
                draggable:true,
                animation: google.maps.Animation.DROP,
                position: taipeiTech
            });

            google.maps.event.addListener(marker, 'click', function(evt){
                codeLatLng(evt.latLng.lat(), evt.latLng.lng());
                console.log('address.hasAddress : ' + $scope.address.hasAddress)
            });

            google.maps.event.addListener(marker, 'dragstart', function(evt){
                $scope.address.hasAddress = false;
            });

            google.maps.event.addListener(marker, 'dragend', function(evt){
                codeLatLng(evt.latLng.lat(), evt.latLng.lng());
                console.log('address.hasAddress : ' + $scope.address.hasAddress)
            });
        });
        
    }

    function codeLatLng(lat, lng) {
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    var content = results[0].formatted_address;
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                    $scope.address.hasAddress = true;
                    $scope.restaurant.address = results[0].formatted_address;
                    // $scope.restaurant.latlng = '(' + lat.toFixed(7) + ',' + lng.toFixed(7) + ')';
                    $scope.restaurant.lat = lat.toFixed(7);
                    $scope.restaurant.lng = lng.toFixed(7);
                    RestaurantManager.setRestaurant($scope.restaurant);
                } else {
                    alert('找不到該地址');
                    $scope.address.hasAddress = false;
                }
            } else {
                alert('Geocoder failed due to: ' + status);
                $scope.address.hasAddress = false;
            }
            $scope.$apply();
        });
    }
    
    $scope.init = function() {
        initialize();
    };

    $scope.onEnterClick = function() {
        $scope.address.hasAddress = false;

        $location.url('/addRestaurants');
        // $state.go('addRestaurants');
    };
});