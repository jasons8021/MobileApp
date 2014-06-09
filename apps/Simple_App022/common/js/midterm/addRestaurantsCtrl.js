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
        $location.url('/foodMap');
    };

    $scope.backButton = [{
        type: 'button-positive',
        content: "<i class='icon ion-arrow-left-a'></i>",
        tap: function() {
            $location.url('/tab/add');
        }
    }];
});