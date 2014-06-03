app.controller('FoodMapCtrl', function($scope, $stateParams, $window){

    var taipeiTech = new google.maps.LatLng(25.043022, 121.534248);
    // var currentLatLng = new google.maps.LatLng($stateParams.latitude, $stateParams.longitude);
    var infowindow = new google.maps.InfoWindow();
    var geocoder;
    var marker;
    var map;
    var latlngFromMarker;

    function initialize() {
        console.log('init ok');
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

        google.maps.event.addListener(marker, 'click', toggleBounce);

        google.maps.event.addListener(marker, 'dragend', function(evt){
            // latlngFromMarker = evt.latLng.lat() + ',' + evt.latLng.lng();
            // document.getElementById('current').innerHTML = '<p>Marker dropped:' + latlngFromMarker + '</p>';
            codeLatLng(evt.latLng.lat(), evt.latLng.lng());
        });
        // google.maps.event.addDomListener(window, 'load', initialize);
        
    }

    function toggleBounce() {
        if (marker.getAnimation() != null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    function codeLatLng(lat, lng) {
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                } else {
                    alert('找不到該地址');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
    }

    $scope.init = function() {
        initialize();
    };
    
});