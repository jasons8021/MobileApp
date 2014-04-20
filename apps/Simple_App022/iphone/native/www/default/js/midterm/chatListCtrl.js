
/* JavaScript content from js/midterm/chatListCtrl.js in folder common */
app.controller('ChatListCtrl', function($scope, FriendManager, MessageManager, Contacts, Notification, $window, $ionicLoading, SettingManager, $http, $rootScope, $ionicScrollDelegate, iLabMember, iLabMessage, $location) {

	$scope.init = function() {
		$scope.messageLogs = MessageManager.list();
		$scope.dialogs = MessageManager.getDialog("0988147147","0988825825");
    };

    $scope.getCount = function() {
		return MessageManager.count();
	};

	$scope.onMessageClick = function() {
		MessageManager.getLatestMessage();
		//$location.url('/test');
	};
});