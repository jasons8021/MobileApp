app.controller('ChatCtrl', function($scope, ChatManager, $stateParams, FriendManager, SettingManager, webServiceMessage, $window, Geolocation, $state){
	$scope.phone = $stateParams.phone;
	$scope.latlng = $stateParams.latlng;
	$scope.chatMessage = {};
	$scope.chatMessage.text = $stateParams.defaultMessage ? $stateParams.defaultMessage : "";
	$scope.chatMessageList = ChatManager.get($scope.phone);
	$scope.friendName = FriendManager.getByPhone($scope.phone).name;
	$scope.hostPhone = SettingManager.getHost().phone;
	
	$scope.$on('receivedMessage', function(event, message) {
		if (message.hasRead) {
			$scope.$apply();
		} else {
			$scope.readMessage(message);
		}
	});
	
	$scope.init = function() {
		for(var index in $scope.chatMessageList) {
			var message = $scope.chatMessageList[index];
			$scope.readMessage(message);
		}
		console.log('$scope.latlng' + $scope.latlng);

		if($scope.latlng != null)
		{
			$scope.chatMessage.text = $scope.latlng;
    		$scope.onSendMessageClick();
		}
	};
	
	$scope.onSendMessageClick = function() {
		if(!$scope.chatMessage.text) {
			console.log('不能發送空訊息');
			return;
		}
		var message = {
        	senderPhone: $scope.hostPhone,
            receiverPhone: $scope.phone,
            message: $scope.chatMessage.text
        };
		webServiceMessage.sendMessage(message);
		$scope.chatMessage.text = "";
	};
    
    $scope.readMessage = function(message) {
    	if(!message.hasRead && message.senderPhone == $scope.phone) {
    		message.hasRead = true;
			webServiceMessage.sendMessage(message);
			ChatManager.read(message, $scope.$apply);
		}
    };
	
    $scope.onLocationClick = function() {

    	$state.go('chooseRestaurant', {
        	phone: $scope.phone
        });

    	// $scope.chatMessage.text = "("+position.coords.latitude+","+position.coords.longitude+")" + $scope.chatMessage.text;
    	// $scope.onSendMessageClick();
    };

    function onError(error) {
    	// alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    	console.log('GPS is not work. code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
	}

    $scope.hasLocation = function(message) {
    	if (message.hasLocation == undefined)
    		message.hasLocation = new RegExp(/^\(([0-9.]+),([0-9.]+)\)/).test(message.message);
    	return message.hasLocation;
    };
    
    $scope.onMessageClick = function(message) {
    	if (message.hasLocation) {
        	var latlng = message.message.match(/([0-9.-]+).+?([0-9.-]+)/);
        	console.log(message.senderPhone == $scope.hostPhone);
        	$state.go('map', {
        		latitude:latlng[1],
        		longitude:latlng[2],
        		friendName:$scope.friendName,
        		isMe:message.senderPhone == $scope.hostPhone
        	});
    	}
    };
    
	$scope.backButton = [{
		type: 'ion-arrow-left-c',
		content: "",
		tap: function() {
			$window.location = "#/tab/chatList";
		}
	}];
});