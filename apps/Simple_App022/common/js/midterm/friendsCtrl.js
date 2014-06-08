app.controller('FriendsCtrl', function($scope, FriendManager, $window, $ionicLoading, $http, $rootScope, $location, $state) {
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

	$scope.onEditClick = function(friend) {
		FriendManager.setFriend(friend);
		$location.url('/editFriends');
	};

	$scope.toURL = function(phone) {
		$state.go('chat',{phone:phone});
	};
	
	$scope.onDeleteClick = function(friendID) {
		var ans = $window.confirm('確定刪除好友嗎？');  
        if (ans) {  
        	FriendManager.remove(friendID, $scope.$apply);
        }
		$scope.state = $scope.CREATE;
	};

	// $scope.onSMSClick = function() {
	// 	var message = $scope.model.name + "：真高興，你又長了一歲。祝你生日快樂，永遠快樂！";
	// 	$window.sms.send($scope.model.phone, message, "INTENT");
	// 	//$window.open("sms:"+ $scope.model.phone + "?body=" + message);
	// };
	
	// $scope.onPhoneClick = function() {
	// 	$window.open("tel:"+ $scope.model.phone);
	// };
	
	// $scope.onEmailClick = function() {
	// 	var subject = "生日快樂！";
	// 	var message = $scope.model.name + "：真高興，你又長了一歲。祝你生日快樂，永遠快樂！";
	// 	$window.plugins.emailComposer.showEmailComposer(subject, message, [$scope.model.email], [], [], true, []);
	// 	//$window.open('mailto:' + $scope.model.email + '?subject=' + subject + '&body=' + message);
	// };
	
});