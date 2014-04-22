
/* JavaScript content from js/midterm/editFriendsCtrl.js in folder common */
app.controller('EditFriendsCtrl', function($scope, FriendManager, MessageManager, Contacts, Notification, $window, $ionicLoading, SettingManager, $http, $rootScope, $ionicScrollDelegate, iLabMember, iLabMessage, $location) {
	$scope.EDIT = 0;
	$scope.DELETE = 2;
	$scope.BLESS = 3;
	$scope.MESSAGE = 4;
	$scope.ADDFRIEND = 5;
	$scope.RECEIVE = 6;
	$scope.state = $scope.EDIT;

	$scope.model = {};
	$scope.message = {};
	$scope.message.text = "";
	$scope.localQueue = new Array();

	$scope.deliveryMessage = {};

	$scope.init = function() {
		$scope.model = FriendManager.getFriend()
		$scope.onReceiveMessage();
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

	// $scope.onBackClick = function() {
	// 	$location.url('/tab/friends');
	// };

	$scope.onSMSClick = function() {
		var message = $scope.model.name + "：恭喜你又老了一歲！";
		$window.sms.send($scope.model.phone, message, "INTENT");
		//$window.open("sms:"+ $scope.model.phone + "?body=" + message);
	};
	
	$scope.onPhoneClick = function() {
		$window.open("tel:"+ $scope.model.phone);
	};
	
	// $scope.onEmailClick = function() {
	// 	var subject = "生日快樂！";
	// 	var message = $scope.model.name + "：恭喜你又老了一歲！";
	// 	$window.plugins.emailComposer.showEmailComposer(subject, message, [$scope.model.email], [], [], true, []);
	// 	//$window.open('mailto:' + $scope.model.email + '?subject=' + subject + '&body=' + message);
	// };
	
	$scope.onSendMessageClick = function() {
		console.log("sender:"+SettingManager.getHost().phone+", receiver:"+$scope.model.phone+", message:"+$scope.message.text);
		iLabMessage.sendMessage(SettingManager.getHost().phone, $scope.model.phone, $scope.message.text);

		$scope.deliveryMessage.message = $scope.message.text;
		$scope.deliveryMessage.senderPhone = SettingManager.getHost().phone;
		$scope.deliveryMessage.receiverPhone = $scope.model.phone;
		$scope.deliveryMessage.messageTime = Date.now();

		console.log("deliveryMessage:"+$scope.deliveryMessage.message+"sender:"+$scope.deliveryMessage.senderPhone+", receiver:"+$scope.deliveryMessage.receiverPhone+", date:"+$scope.deliveryMessage.messageTime);
		MessageManager.send($scope.deliveryMessage, $scope.$apply);

		$scope.message.text = "";
		$scope.state = $scope.BLESS;
	};
	
	$scope.onMessageClick = function() {
		$scope.state = $scope.MESSAGE;
	};
	
	$scope.onReceiveMessageClick = function() {
		if ($scope.localQueue.length > 0)
			$scope.showMessage();
		else {
			$scope.state = $scope.MESSAGE;
			$scope.message.text = "";
		}
	};
	
	$scope.onReceiveMessage = function() {
		$rootScope.$on('mqtt.notification', function(event, message) {
			$scope.localQueue.push(message);
			if ($scope.state != $scope.RECEIVE){
				$scope.state = $scope.RECEIVE;
				$scope.showMessage();
			}
    	});
	};

	$scope.showMessage = function() {
		while ($scope.localQueue.length > 0) {
			var data = $scope.localQueue.shift();
			var index = data.indexOf(":");
			var phone = data.substring(0, index);
			var message = data.substring(index + 1, data.length);
			var friend = FriendManager.getByPhone(phone);
			if (friend) {
				$scope.state = $scope.RECEIVE;
				$scope.model = friend;
				$scope.message.text = message;
				$scope.$apply();

				$scope.deliveryMessage.message = message;
				$scope.deliveryMessage.senderPhone = phone;
				$scope.deliveryMessage.receiverPhone = SettingManager.getHost().phone;
				$scope.deliveryMessage.messageTime = Date.now();

				console.log("deliveryMessage:"+$scope.deliveryMessage.message+"sender:"+$scope.deliveryMessage.senderPhone+", receiver:"+$scope.deliveryMessage.receiverPhone+", date:"+$scope.deliveryMessage.messageTime);
				MessageManager.send($scope.deliveryMessage, $scope.$apply);

				break;
			}
		}
	};
});