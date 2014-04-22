
/* JavaScript content from js/midterm/chatListCtrl.js in folder common */
app.controller('ChatListCtrl', function($scope, FriendManager, MessageManager, Contacts, Notification, $window, $ionicLoading, SettingManager, $http, $rootScope, $ionicScrollDelegate, iLabMember, iLabMessage, $location) {

	// h : 自己、g : 對方
	$scope.hgPhone = {};

	$scope.init = function() {
		$scope.messageLogs = MessageManager.list();
		$scope.latestMessages = MessageManager.getLatestMessage();
    };

    $scope.getCount = function() {
		return MessageManager.count();
	};

	$scope.onMessageClick = function(mid) {
		MessageManager.getById(mid);
		//console.log("senderPhone : "+ MessageManager.getById(mid).senderPhone +", receiverPhone : "+MessageManager.getById(mid).receiverPhone);
		if (MessageManager.getById(mid).senderPhone == SettingManager.getHost().phone) {
			$scope.hgPhone.hostPhone = MessageManager.getById(mid).senderPhone
			$scope.hgPhone.guestPhone = MessageManager.getById(mid).receiverPhone
		}
		else{
			$scope.hgPhone.hostPhone = MessageManager.getById(mid).receiverPhone
			$scope.hgPhone.guestPhone = MessageManager.getById(mid).senderPhone
		}
		MessageManager.setHGPhone($scope.hgPhone);

		$location.url('/chatRoom');
	};
});