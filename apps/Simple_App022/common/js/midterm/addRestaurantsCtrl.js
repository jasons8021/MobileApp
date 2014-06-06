app.controller('AddRestaurantsCtrl', function($scope, Notification, $window, $ionicLoading, $location, RestaurantManager, webServiceRestaurant) {

	$scope.restaurant = {};

    $scope.show = function() {
        $scope.loading = $ionicLoading.show({
            content: "<i class='ion-loading-b'></i>",
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 500
        });
    };
    
    $scope.hide = function(){
    	$scope.loading.hide();
    };

	$scope.init = function() {
        $scope.restaurant = RestaurantManager.getRestaurant();
    };

	$scope.onCreateClick = function() {
		if (!$scope.restaurant.name || !$scope.restaurant.address ) {
			Notification.alert("請輸入餐廳名稱", null, '警告', '確定');
			return;
		}
        
        var restaurant = {
            name: $scope.restaurant.name,
            phone: typeof($scope.restaurant.phone)=='undefined' ? "" : $scope.restaurant.phone,
            address: $scope.restaurant.address,
            latlng: '(' + $scope.restaurant.lat + ',' + $scope.restaurant.lng + ')'
        };

        webServiceRestaurant.addRestaurant(restaurant);

		RestaurantManager.clearLocalStorage();
		$location.url('/tab/friends');
	};
	
    $scope.onLocateClick = function() {
        RestaurantManager.setRestaurant($scope.restaurant);
        $location.url('/tab/foodMap');
    };
    
    $scope.ontestClick = function() {
        webServiceRestaurant.getRestaurantList(
            function(response) {
                console.log('response : ' + response);
                for(var i in response)
                {
                    console.log('名稱 : ' + response[i].name + ', 地址 : ' + response[i].address + ', 經緯度 : ' + response[i].latlng);
                }
                
            },function() {
                console.log('error');
            });
    };
    /*
    for(var key in myarr){ 
          content +="陣列索引："+ key+" ; 值： "+myobj[key]+"\n"; 
} 
    webServiceMember.isMember(friend.phone, function(response) {
                friend.isMember = JSON.parse(response);
                DBManager.addFriend(friend, function() {
                    idIndexedFriends[friend.id] = friend;
                    phoneIndexedFriends[friend.phone] = friend;
                    (onSuccess || angular.noop)();
                }, onError);
            }, function() {
                friend.isMember = false;
                DBManager.addFriend(friend, function() {
                    idIndexedFriends[friend.id] = friend;
                    phoneIndexedFriends[friend.phone] = friend;
                    (onSuccess || angular.noop)();
                }, onError);
            });
    */

    $scope.backButton = [{
        type: 'ion-arrow-left-c',
        content: "",
        tap: function() {
            RestaurantManager.clearLocalStorage();
            $window.location = "#/tab/add";
        }
    }];
});