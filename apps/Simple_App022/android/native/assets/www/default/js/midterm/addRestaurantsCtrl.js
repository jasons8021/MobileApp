
/* JavaScript content from js/midterm/addRestaurantsCtrl.js in folder common */
app.controller('AddRestaurantsCtrl', function($scope, Notification, $window, $ionicLoading, $location) {

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

    };
    
	$scope.onCreateClick = function() {
		if (!$scope.restaurant.name || !$scope.restaurant.phone || !$scope.restaurant.address ) {
			Notification.alert("請輸入姓名及電話", null, '警告', '確定');
			return;
		}
		// FriendManager.add($scope.model, $scope.$apply);
		$scope.restaurant = {};
		$location.url('/tab/friends');
	};
	
    $scope.onLocateClick = function() {
        $location.url('/tab/friends');
    };

    $scope.backButton = [{
        type: 'ion-arrow-left-c',
        content: "",
        tap: function() {
            $window.location = "#/tab/add";
        }
    }];
});