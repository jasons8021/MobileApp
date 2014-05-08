
/* JavaScript content from js/midterm/editFriendsCtrl.js in folder common */
app.controller('EditFriendsCtrl', function($scope, FriendManager, Notification, $window, $ionicLoading, $http, $rootScope, $location) {
	$scope.EDIT = 0;
	$scope.state = $scope.EDIT;

	$scope.model = {};

	$scope.init = function() {
		$scope.model = FriendManager.getFriend()
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
	
	$scope.onEditClick = function() {
		
		FriendManager.edit($scope.model, $scope.$apply);
		FriendManager.setFriend($scope.model);
		Notification.alert("修改完成！", null, '通知', '確定');
		$scope.state = $scope.EDIT;
	};

	$scope.onCancelClick = function() {
		$scope.model = FriendManager.getFriend();
		$scope.state = $scope.EDIT;
	};
	
	$scope.backButton = [{
		type: 'button-positive',
		content: "<i class='icon ion-arrow-left-a'></i>",
		tap: function() {
				$location.url('/tab/friends');
			}
	}];

	$scope.onSMSClick = function() {
		var message = $scope.model.name + "：恭喜你又老了一歲！";
		$window.sms.send($scope.model.phone, message, "INTENT");
		//$window.open("sms:"+ $scope.model.phone + "?body=" + message);
	};
	
	$scope.onPhoneClick = function() {
		$window.open("tel:"+ $scope.model.phone);
	};
});