app.controller('AddCtrl', function($scope, $window, RestaurantManager, $state, $http) {

    $scope.init = function() {
    	$scope.restaurant = {};
        RestaurantManager.setRestaurant($scope.restaurant);
        console.log('add initial');
    };

	$scope.onAddFriendClick = function() {
        $state.go('addFriends');
    };

    $scope.onAddRestaurantClick = function() {
        $state.go('addRestaurants');
    };
});