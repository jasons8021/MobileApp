app.controller('MapCtrl', function($scope, $stateParams, Geolocation, $window){
	$scope.friendName = $stateParams.friendName;
	$scope.isMe = JSON.parse($stateParams.isMe);
	$scope.position = {};
	$scope.distance = {};
	$scope.distance.text = "";
	$scope.duration = {};
	$scope.duration.text = "";
	$scope.zoom = 13;
	
	$scope.init = function() {
		if($scope.isMe) {
			var origin = new google.maps.LatLng($stateParams.latitude, $stateParams.longitude);
			var mapOptions = {
				    zoom: $scope.zoom,
				    center: origin,
				    disableDefaultUI: true
				  };
			var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			var marker = new MarkerWithLabel({
			    position: origin,
			    labelContent: "我",
			    labelAnchor: new google.maps.Point(30, 0),
			    labelClass: "labels",
			    labelStyle: {opacity: 0.75}
			});
			$scope.friendName = "我的位置";	
			marker.setMap(map);
		} else {
			Geolocation.getCurrentPosition(function(position) {
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
						var destinationMarker = new MarkerWithLabel({
							position: new google.maps.LatLng(leg.end_location.k, leg.end_location.A),
						    labelContent: $scope.friendName,
						    labelAnchor: new google.maps.Point(30, 0),
						    labelClass: "labels"
						});
				    	var originMarker = new MarkerWithLabel({
						    position: new google.maps.LatLng(leg.start_location.k, leg.start_location.A),
						    labelContent: "我",
						    labelAnchor: new google.maps.Point(30, 0),
						    labelClass: "labels"
						});
				    	originMarker.setMap(map);
				    	destinationMarker.setMap(map);
						directionsDisplay.setMap(map);
				    }
				});
			});
		}
	};
});