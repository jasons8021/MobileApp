
/* JavaScript content from js/midterm/publishCtrl.js in folder common */
app.controller('PublishCtrl', function($scope, ChatManager, $ionicScrollDelegate, FriendManager, SettingManager, iLabMessage, $window, $rootScope){
	$scope.host = SettingManager.getHost();
	$scope.publisherName = $scope.host.publisherName;
	$scope.publisherId = $scope.host.publisherId;
	$scope.message = {};
	$scope.message.text = "";
	$scope.chatMessages = ChatManager.get($scope.publisherId);
	
	$scope.$on('receivedMessage', function(res, message) {
		if(message.hasRead) {
			$scope.$apply();
		} else {			
			$scope.readMessage(message);
		}
	});
	
	$scope.init = function() {
		console.log("publishCtrl Init");
		for(var index in $scope.chatMessages) {
			var chatMessage = $scope.chatMessages[index];
			$scope.readMessage(chatMessage);
		}
	};
	
	$scope.reverse = function(array) {
        return [].concat(array).reverse();
    };
    
    $scope.readMessage = function(chatMessage) {
    	if(!chatMessage.hasRead && chatMessage.senderPhone == $scope.phone) {
			iLabMessage.readMessage(chatMessage.msgId);
			ChatManager.read(chatMessage, $scope.$apply);
		}
    };
    
    $scope.isSubscribe = function() {
    	return SettingManager.publisherId ? true : false;
    };
});