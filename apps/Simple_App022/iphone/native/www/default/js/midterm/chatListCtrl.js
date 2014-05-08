
/* JavaScript content from js/midterm/chatListCtrl.js in folder common */
app.controller('ChatListCtrl', function($scope, ChatManager, $window, FriendManager){
	$scope.friends = FriendManager.list();
	
	$scope.messages = ChatManager.list();
	
	$scope.getCount = function() {
		return FriendManager.count();
	};
	
	$scope.toURL = function(url) {
		$window.location = url;
	};
	
	$scope.getUnread = function(phone) {
		var s = 0;
		var messages = ChatManager.get(phone);
		for(var index in messages) {
			var message = messages[index];
			if(message.senderPhone == phone && !message.hasRead) {
				s++;
			}
		}
		return s;
	};
	
	$scope.refreshFriend = function() {
		for(var i in $scope.friends) {
			FriendManager.edit( $scope.friends[i]);
		}
	};
	
	$scope.refreshButton = [{
		type: 'ion-loop',
		content: "",
		tap: $scope.refreshFriend
	}];
});