app.controller('ChooseRestaurantCtrl', function($scope, RestaurantManager, Geolocation, $location, $window, webServiceRestaurant){
    
    $scope.hasChosen = true;
    $scope.
    var taipeiTech = new google.maps.LatLng(25.043022, 121.534248);
    var getInfoWindow = (function(){
        var infowindow = null;
        return function(){
           if(infowindow == null){
               infowindow = new google.maps.InfoWindow({
               });
           }
           return infowindow;
        };
    })();
    var restaurantList = [];
    var restaurantLatLngs = [];
    var markers = [];
    // var infowindows = [];
    var currentLatLng;
    var geocoder;
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
        // setMarkers(map, currentPosition);

        for(var i in restaurantLatLngs)
        {
        	var marker = new google.maps.Marker({
	        	map:map,
	        	draggable:false,
	        	animation: google.maps.Animation.DROP,
                title: restaurantList[i].name,
	        	position: new google.maps.LatLng(restaurantLatLngs[i][1], restaurantLatLngs[i][2])
        	});
            attachMessage(marker);
            markers.push(marker);
        }
        
    }

    function attachMessage(marker) {
        google.maps.event.addListener(marker, 'click', function() {
            getInfoWindow().setContent(marker.title);
            getInfoWindow().open(marker.get('map'), marker);
        });
    }

    function getRestaurantList() {
    	webServiceRestaurant.getRestaurantList(function(response) {
            console.log('response : ' + response);
            for(var i in response)
            {
            	var restaurantInfo = response[i];
                console.log('i : ' + i + '名稱 : ' + restaurantInfo.name + ', 地址 : ' + restaurantInfo.address + ', 經緯度 : ' + restaurantInfo.latlng);
                restaurantList.push(restaurantInfo);

                var latlng = restaurantInfo.latlng.match(/([0-9.-]+).+?([0-9.-]+)/);
                console.log('latlng\' lat : ' + latlng[1] + ', latlng\'s lng : ' + latlng[2]);

                restaurantLatLngs.push(latlng);
            }
        },function() {
            console.log('error');
        });
    }

    $scope.init = function() {
    	getRestaurantList();
    	Geolocation.getCurrentPosition(function(position) {
            console.log('gps work');
            currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
            initialize(currentLatLng);
        }, function(error){
            initialize(taipeiTech);
        });
    };

    $scope.onEnterClick = function() {
    	for(var i in restaurantList)
        {
        	console.log('Enter click');
        	console.log('Enter click -- 名稱 : ' + restaurantList[i].name + ', 地址 : ' + restaurantList[i].address + ', 經緯度 : ' + restaurantList[i].latlng);
        }

        for (var i in restaurantLatLngs) {
        	console.log('Enter click -- Lat : ' + restaurantLatLngs[i][1] + ', Lng : ' + restaurantLatLngs[i][2]);
        };

        for (var i in markers) {
            console.log('Enter click -- marker ' + i + ' : ' + markers[i].title);
        };

        
        // $scope.hasChosen = false;
    };
});