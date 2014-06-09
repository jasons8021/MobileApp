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

    document.addEventListener("deviceready", onDeviceReady, false);

    // PhoneGap is ready
    //
    function onDeviceReady() {
        Geolocation.getCurrentPosition(onSuccess, onError);
    }

    function onSuccess(position) {
        console.log('geolocation success');
        currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log('geolocation success, currentLatLng : ' + currentLatLng);
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        console.log('geolocation fail');
        currentLatLng = new google.maps.LatLng(25.043022, 121.534248);
    }

    function initialize(currentPosition) {
        var mapOptions = {
            zoom: 17,
            center: currentPosition
        };

        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('foodMap-canvas'), mapOptions);
        marker = new google.maps.Marker({
            map:map,
            draggable:true,
            animation: google.maps.Animation.DROP,
            position: currentPosition
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
        Geolocation.getCurrentPosition(function(position) {
            console.log('gps work');
            currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
            initialize(currentLatLng);
        }, function(error){
            initialize(taipeiTech);
        });
    };

    $scope.onEnterClick = function() {
        $scope.address.hasAddress = false;

        $location.url('/addRestaurants');
        // $state.go('addRestaurants');
    };
});