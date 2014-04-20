
/* JavaScript content from js/midterm/friendsCtrl-Mid.js in folder common */
app.controller('FriendsCtrl', function($scope, FriendManager, Contacts, Notification, $window, $ionicLoading, SettingManager, $http, $rootScope, $ionicScrollDelegate, iLabMember, iLabMessage, $location) {
	$scope.CREATE = 0;
	$scope.EDIT = 1;
	$scope.DELETE = 2;
	$scope.BLESS = 3;
	$scope.MESSAGE = 4;
	$scope.ADDFRIEND = 5;
	$scope.RECEIVE = 6;
	$scope.state = $scope.CREATE;

	$scope.model = {};
	$scope.message = {};
	$scope.message.text = "";
	$scope.friends = null;
	$scope.localQueue = new Array();

	$scope.init = function() {
		$scope.friends = FriendManager.list();
		// $scope.onReceiveMessage();
    };
    
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

	var getMobileNumber = function(phoneNumbers) {
		if (!(phoneNumbers instanceof Array))
			return null;
		for (var i = 0, max = phoneNumbers.length; i < max; i++) {
			if (phoneNumbers[i].type == 'mobile')
				return phoneNumbers[i].value;
		}
		return null;
	};
	
	$scope.getCount = function() {
		return FriendManager.count();
	};
	
	$scope.onFriendClick = function() {
		$location.url('/test');
	};
	
});