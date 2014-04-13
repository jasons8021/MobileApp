
/* JavaScript content from js/07_queue/friendsCtrl.js in folder common */
app.controller('FriendsCtrl', function($scope, FriendManager, Contacts, Notification, $window, $ionicLoading, SettingManager, $http, $rootScope, $ionicScrollDelegate, iLabMember, iLabMessage) {
	$scope.CREATE = 0;
	$scope.EDIT = 1;
	$scope.DELETE = 2;
	$scope.BLESS = 3;
	$scope.MESSAGE = 4;
	$scope.ADDFRIEND = 5;
	$scope.RECEIVE = 6;
	$scope.state = $scope.CREATE;

	$scope.model = {};
	$scope.message = {};
	$scope.message.text = "";
	$scope.friends = null;
	$scope.localQueue = new Array();

	$scope.init = function() {
		$scope.friends = FriendManager.list();
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
    
	$scope.onCreateClick = function() {
		if (!$scope.model.name || !$scope.model.phone) {
			Notification.alert("請輸入姓名及電話", null, '警告', '確定');
			return;
		}
		FriendManager.add($scope.model, $scope.$apply);
		$scope.model = {};
	};
	
	$scope.onFriendClick = function(STATE, id) {
		$scope.state = STATE;
		$ionicScrollDelegate.scrollTop();
		$scope.model = angular.copy($scope.friends[id]);
	};
	
	$scope.onEditClick = function() {
		FriendManager.edit($scope.model, $scope.$apply);
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.onDeleteClick = function() {
		FriendManager.remove($scope.model, $scope.$apply);
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.onCancelClick = function() {
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.setFriendsFromContacts = function() {
		$scope.show();
        var options = new ContactFindOptions();
        options.multiple = true;
        options.filter = "";
        var fields = ["displayName", "phoneNumbers", "emails", "birthday"];
        Contacts.find(fields, $scope.onSetFriendsFromContactsSuccess, $scope.onSetFriendsFromContactsError, options);
	};

    $scope.onSetFriendsFromContactsSuccess = function(contactArray) {
        for (var i = 0, max = contactArray.length; i < max; i++) {
        	var contactName = contactArray[i].displayName;
        	if (!contactName)
        		continue;
        	var mobileNumber = getMobileNumber(contactArray[i].phoneNumbers);
        	if (!mobileNumber)
        		continue;
        	mobileNumber = mobileNumber.replace(/-/g, "").replace(/ /g, "");
            var friend = {
                name: contactName,
                phone: mobileNumber,
                email: (contactArray[i].emails && contactArray[i].emails.length > 0) ? contactArray[i].emails[0].value : "",
                birthday: contactArray[i].birthday
            };
            FriendManager.add(friend, $scope.$apply);
        }
        $scope.hide();
        $scope.state = $scope.CREATE;
    };
	
	var getMobileNumber = function(phoneNumbers) {
		if (!(phoneNumbers instanceof Array))
			return null;
		for (var i = 0, max = phoneNumbers.length; i < max; i++) {
			if (phoneNumbers[i].type == 'mobile')
				return phoneNumbers[i].value;
		}
		return null;
	};
	
    $scope.onSetFriendsFromContactsError = function(e) {
        console.log(e);
        $scope.hide();
        $scope.state = $scope.CREATE;
    };
	    
	$scope.newFriendsButton = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus'></i>",
		tap: function() {
				$scope.onFriendClick($scope.ADDFRIEND);
			}
	}];
	
	$scope.getCount = function() {
		return FriendManager.count();
	};
	
	$scope.onSMSClick = function() {
		var message = $scope.model.name + "：恭喜你又老了一歲！";
		$window.sms.send($scope.model.phone, message, "INTENT");
		//$window.open("sms:"+ $scope.model.phone + "?body=" + message);
	};
	
	$scope.onPhoneClick = function() {
		$window.open("tel:"+ $scope.model.phone);
	};
	
	$scope.onEmailClick = function() {
		var subject = "生日快樂！";
		var message = $scope.model.name + "：恭喜你又老了一歲！";
		$window.plugins.emailComposer.showEmailComposer(subject, message, [$scope.model.email], [], [], true, []);
		//$window.open('mailto:' + $scope.model.email + '?subject=' + subject + '&body=' + message);
	};
	
	$scope.onSendMessageClick = function() {
		iLabMessage.sendMessage(SettingManager.getHost().phone, $scope.model.phone, $scope.message.text);
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
			// "0988825823", "receiverPhone": "0988824823", "message": "測試訊息", "time": "2014-04-13T22:55:44.5816418+08:00", "hasRead": false, "msgId": 1474 }
			var friend = FriendManager.getByPhone(phone);
			if (friend) {
				$scope.state = $scope.RECEIVE;
				$scope.model = friend;
				$scope.message.text = message;
				$scope.$apply();
				break;
			}
		}
	};
});