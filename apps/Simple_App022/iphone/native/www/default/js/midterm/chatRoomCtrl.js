
/* JavaScript content from js/midterm/chatRoomCtrl.js in folder common */
app.controller('ChatRoomCtrl', function($scope, FriendManager, MessageManager, $window, SettingManager, $http, $rootScope, $ionicScrollDelegate, iLabMessage) {
	
	$scope.READ = 0;
	$scope.MESSAGE = 1;
	$scope.state = $scope.READ;

	$scope.hgPhone = {};
	$scope.messageLogs = null;
	$scope.deliveryMessage = {};
	$scope.textModel = {};

	$scope.init = function() {
		$scope.messageLogs = MessageManager.list();
		$scope.hgPhone = MessageManager.getHGPhone();

		$scope.deliveryMessage.senderPhone = $scope.hgPhone.hostPhone;
		$scope.deliveryMessage.receiverPhone = $scope.hgPhone.guestPhone;

		$ionicScrollDelegate.scrollBottom(true);
		$scope.state = $scope.READ;
    };

    $scope.getHasDialog = function() {
    	// console.log("MessageManager.getHasDialog() = " + MessageManager.getHasDialog($scope.hgPhone.hostPhone, $scope.hgPhone.guestPhone));
		return MessageManager.getHasDialog($scope.hgPhone.hostPhone, $scope.hgPhone.guestPhone);
	};

	$scope.onSendClick = function() {
		$scope.state = $scope.MESSAGE;
		$scope.textModel.message = "";
		$ionicScrollDelegate.scrollTop(true);
	};

	$scope.onSendMessageClick = function() {
		//console.log("sender:" + $scope.hgPhone.hostPhone + ", receiver:" + $scope.hgPhone.guestPhone + ", message:" + $scope.deliveryMessage.message;
		$scope.deliveryMessage.message = $scope.textModel.message;
		$scope.deliveryMessage.messageTime = Date.now();

		iLabMessage.sendMessage(SettingManager.getHost().phone, $scope.hgPhone.guestPhone, $scope.deliveryMessage.message);
		// console.log("deliveryMessage:" + $scope.deliveryMessage.message + "sender:" + $scope.deliveryMessage.senderPhone + ", receiver:" + $scope.deliveryMessage.receiverPhone + ", date:" + $scope.deliveryMessage.messageTime);
		MessageManager.send($scope.deliveryMessage, function() {
			$ionicScrollDelegate.scrollBottom(true);
			$scope.state = $scope.READ;
			$scope.$apply();
		});
	};

	$scope.isHost = function (messageLog) {
		return (messageLog.senderPhone == $scope.hgPhone.hostPhone);
	};

	$scope.isDialog = function(messageLog){
		var msg = MessageManager.getById(messageLog.id).message;
		// console.log(messageLog.id + ". messageByDB = " + msg + ", message.length = " + msg.length);
		return ((messageLog.senderPhone == $scope.hgPhone.hostPhone && messageLog.receiverPhone == $scope.hgPhone.guestPhone) || (messageLog.receiverPhone == $scope.hgPhone.hostPhone && messageLog.senderPhone == $scope.hgPhone.guestPhone));
	};
});

app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];

    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      	return (a[field] > b[field]);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});