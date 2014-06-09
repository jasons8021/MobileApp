app.controller('MapCtrl', function($scope, $stateParams, Geolocation, $window, $state){
	$scope.restaurantName = $stateParams.restaurantName;
	$scope.phone = $stateParams.phone;
	$scope.position = {};
	$scope.distance = {};
	$scope.distance.text = "";
	$scope.duration = {};
	$scope.duration.text = "";
	$scope.zoom = 13;

	var infowindowOriginal = new google.maps.InfoWindow();
	var infowindowDestination = new google.maps.InfoWindow();

	document.addEventListener("deviceready", onDeviceReady, false);

    // PhoneGap is ready
    //
    function onDeviceReady() {
        Geolocation.getCurrentPosition(function(position){
        	console.log('position' + position);
        }, function(error){
        	console.log('error' + error);
        });
    }

	$scope.init = function() {
		console.log('$scope.restaurantName ' + $scope.restaurantName);
		Geolocation.getCurrentPosition(onSuccess, onError);
	};

	function onSuccess(position) {
		var directionsService = new google.maps.DirectionsService();
		var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var destination = new google.maps.LatLng($stateParams.latitude, $stateParams.longitude);
		var mapOptions = {
			    zoom: $scope.zoom,
			    center: origin,
			    disableDefaultUI: true
			  };
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		var markerOptions = {
			visible:false
		};
		var directionsRendererOptions = {
			markerOptions: markerOptions,
			map: map,
		};
		var directionsDisplay = new google.maps.DirectionsRenderer(directionsRendererOptions);
		var request = {
			    origin:origin,
			    destination:destination,
			    travelMode: google.maps.TravelMode.WALKING
			};
		directionsService.route(request, function(result, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		    	var leg = result.routes[0].legs[0];
		    	directionsDisplay.setDirections(result);
		    	$scope.distance.text = leg.distance.text;
		    	$scope.duration.text = leg.duration.text;
		    	$scope.$apply();

		    	var image = {
				  	url: 'images/destinationFlag.png',
				  	// This marker is 20 pixels wide by 32 pixels tall.
				  	size: new google.maps.Size(20, 32),
				  	// The origin for this image is 0,0.
				  	origin: new google.maps.Point(0,0),
				  	// The anchor for this image is the base of the flagpole at 0,32.
				  	anchor: new google.maps.Point(0, 32)
				};
				var shape = {
				    coords: [1, 1, 1, 20, 18, 20, 18 , 1],
				    type: 'poly'
				};

				var destinationMarker = new google.maps.Marker({
				    position: new google.maps.LatLng(leg.end_location.k, leg.end_location.A),
				    map: map,
				    icon: image,
				    shape: shape
				});

				infowindowDestination.setContent($scope.restaurantName);
				infowindowDestination.open(map, destinationMarker);

				var originMarker = new google.maps.Marker({
					position: new google.maps.LatLng(leg.start_location.k, leg.start_location.A),
		            map:map,
		            icon : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
		        });

                infowindowOriginal.setContent('我在這');
                infowindowOriginal.open(map, originMarker);

				directionsDisplay.setMap(map);
		    }
		});
	}
			
	function onError(error) {
    	alert('請開啟GPS');
	}

	$scope.backButton = [{
        type: 'button-positive',
        content: "<i class='icon ion-arrow-left-a'></i>",
        tap: function() {
            $state.go('chat', {
                phone : $scope.phone,
                latlng : null,
                restaurantName : null
            });
        }
    }];
});