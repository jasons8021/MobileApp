app.controller('AddCtrl', function($scope, $window, $state, $http) {

    $scope.init = function() {
        console.log('add initial');
    };

	$scope.onAddFriendClick = function() {
        $state.go('addFriends');
    };

    $scope.onAddRestaurantClick = function() {
        $state.go('addRestaurants');
    };
});