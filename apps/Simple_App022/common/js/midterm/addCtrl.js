app.controller('AddCtrl', function($scope, $window, RestaurantManager, $state, $http) {

    $scope.init = function() {
        
    };

	$scope.onAddFriendClick = function() {
        $state.go('addFriends');
    };

    $scope.onAddRestaurantClick = function() {
        RestaurantManager.clearLocalStorage();
        $state.go('addRestaurants');
    };
});