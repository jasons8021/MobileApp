
/* JavaScript content from js/midterm/chatRoomCtrl.js in folder common */
app.controller('ChatRoomCtrl', function($scope, FriendManager, MessageManager, Contacts, Notification, $window, $ionicLoading, SettingManager, $http, $rootScope, $ionicScrollDelegate, iLabMember, iLabMessage, $location) {
	
	$scope.READ = 0;
	$scope.MESSAGE = 1;
	$scope.state = $scope.READ;

	$scope.hgPhone = {};
	$scope.dialogs = {};
	$scope.message = {};
	$scope.message.text = "";
	$scope.deliveryMessage = {};

	$scope.init = function() {
		$scope.messageLogs = MessageManager.list();
		$scope.hgPhone = MessageManager.getHGPhone();
		// console.log("host : " + $scope.hgPhone.hostPhone + ", guest : " + $scope.hgPhone.guestPhone);
		$scope.dialogs = MessageManager.getDialog($scope.hgPhone.hostPhone, $scope.hgPhone.guestPhone);
		// tempDialog = MessageManager.getDialog($scope.hgPhone.hostPhone,$scope.hgPhone.guestPhone);
		$ionicScrollDelegate.scrollBottom(true);
		$scope.state = $scope.READ;
    };

    $scope.getDialogCount = function() {
    	// console.log("dialogs length : " + Object.keys($scope.dialogs).length);
		return Object.keys($scope.dialogs).length;
	};

	$scope.onSendClick = function() {
		$scope.state = $scope.MESSAGE;
		$ionicScrollDelegate.scrollTop(true);
	};

	$scope.onSendMessageClick = function() {
		//console.log("sender:" + $scope.hgPhone.hostPhone + ", receiver:" + $scope.hgPhone.guestPhone + ", message:" + $scope.message.text);
		iLabMessage.sendMessage(SettingManager.getHost().phone, $scope.hgPhone.guestPhone, $scope.message.text);

		$scope.deliveryMessage.message = $scope.message.text;
		$scope.deliveryMessage.senderPhone = $scope.hgPhone.hostPhone;
		$scope.deliveryMessage.receiverPhone = $scope.hgPhone.guestPhone;
		$scope.deliveryMessage.messageTime = Date.now();

		// console.log("deliveryMessage:" + $scope.deliveryMessage.message + "sender:" + $scope.deliveryMessage.senderPhone + ", receiver:" + $scope.deliveryMessage.receiverPhone + ", date:" + $scope.deliveryMessage.messageTime);
		MessageManager.send($scope.deliveryMessage, $scope.$apply);

		$ionicScrollDelegate.scrollBottom(true);
		$scope.message.text = "";
		$scope.$apply();
	};

	$scope.isHost = function (dialog) {
		return (dialog.senderPhone==$scope.hgPhone.hostPhone);
	}
});

app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];

    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
    	// console.log("a=" + a[field] + ", b=" + b[field]);
      	return (a[field] > b[field]);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});