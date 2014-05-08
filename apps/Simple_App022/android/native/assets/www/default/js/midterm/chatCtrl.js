
/* JavaScript content from js/midterm/chatCtrl.js in folder common */
app.controller('ChatCtrl', function($scope, ChatManager, $stateParams, $ionicScrollDelegate, FriendManager, SettingManager, iLabMessage, $window, $rootScope, Geolocation, $state){
	$scope.phone = $stateParams.phone;
	$scope.message = {};
	$scope.message.text = "";
	$scope.chatMessages = ChatManager.get($scope.phone);
	$scope.friendName = FriendManager.getByPhone($scope.phone).name;
	$scope.hostPhone = SettingManager.getHost().phone;;
	
	$scope.$on('receivedMessage', function(res, message) {
		if(message.hasRead) {
			$scope.$apply();
		} else {			
			$scope.readMessage(message);
		}
	});
	
	$scope.init = function() {
		for(var index in $scope.chatMessages) {
			var chatMessage = $scope.chatMessages[index];
			$scope.readMessage(chatMessage);
		}
	};
	
	$scope.onSendMessageClick = function() {
		if(!$scope.message.text) {
			console.log('不能發送空訊息');
			return;
		}
		var deliverymessage = {
        	senderPhone: $scope.hostPhone,
            receiverPhone: $scope.phone,
            message: $scope.message.text
        };
		
		iLabMessage.sendMessage(deliverymessage);
		$scope.message.text = "";

	};
	
	$scope.reverse = function(array) {
        return [].concat(array).reverse();
    };
    
    $scope.readMessage = function(chatMessage) {
    	if(!chatMessage.hasRead && chatMessage.senderPhone == $scope.phone) {
    		chatMessage.hasRead = true;
			iLabMessage.sendMessage(chatMessage);
			ChatManager.read(chatMessage, $scope.$apply);
		}
    };


    $scope.onLocationClick = function() {
    	Geolocation.getCurrentPosition(function(position) {
    		$scope.message.text = "("+position.coords.latitude+","+position.coords.longitude+")" + $scope.message.text;
    		$scope.onSendMessageClick();
    	});
    };
    
    $scope.hasLocation = function(chatMessage) {
    	console.log("hasLocation : chatMessage的訊息：" + chatMessage.message);
    	if (chatMessage.hasLocation == undefined)
    	{
    		chatMessage.hasLocation = new RegExp(/^\(([0-9.]+),([0-9.]+)\)/).test(chatMessage.message);
    		console.log("hasLocation = " + chatMessage.hasLocation);
    	}

    	return chatMessage.hasLocation;
    };
    
    $scope.onMessageClick = function(chatMessage) {
    	if (chatMessage.hasLocation) {
        	var latlng = chatMessage.message.match(/([0-9.-]+).+?([0-9.-]+)/);
        	console.log(chatMessage.senderPhone == $scope.hostPhone);
        	$state.go('map', {
        		latitude:latlng[1],
        		longitude:latlng[2],
        		friendName:$scope.friendName,
        		isMe:chatMessage.senderPhone == $scope.hostPhone
        	});
    	}
    };

	$scope.backButton = [{
		type: 'button-clear ion-ios7-arrow-back',
		content: "",
		tap: function() {
			$window.location = "#/tab/chatList";
		}
	}];
});