app.controller('HelloSMSCtrl', function($scope, FriendManager, Contacts, Notification, $window) {
	$scope.CREATE = 0;
	$scope.EDIT = 1;
	$scope.DELETE = 2;
	$scope.BLESS = 3;
	$scope.state = $scope.CREATE;

	$scope.model = {};
	$scope.friends;
	    
	$scope.init = function() {
		$scope.friends = FriendManager.list();
    };
    
	$scope.onCreateClick = function() {
		if (!$scope.model.name || !$scope.model.phone) {
			Notification.alert("請輸入姓名及電話", null, '警告', '確定');
			return;
		}
		FriendManager.add($scope.model);
		$scope.model = {};
	};
	
	$scope.onFriendClick = function(STATE, id) {
		$scope.state = STATE;
		$scope.model = angular.copy($scope.friends[id]);
	};
	
	$scope.onEditClick = function() {
		FriendManager.edit($scope.model);
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.onDeleteClick = function() {
		FriendManager.remove($scope.model);
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.onCancelClick = function() {
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.setFriendsFromContacts = function() {
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
            FriendManager.add(friend);
        }
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
    };
	
	$scope.getCount = function() {
		return FriendManager.count();
	};
	
	$scope.onSMSClick = function() {
		var message = $scope.model.name + "恭喜你又老了一歲";
		$window.sms.send($scope.model.phone, message, "INTENT");
		//$window.open("sms:"+ $scope.model.phone + "?body=" + message);
	};
	
	$scope.onPhoneClick = function() {
		$window.open("tel:"+ $scope.model.phone);
	};
	
	$scope.onEmailClick = function() {
		var subject = "生日快樂！";
		var message = $scope.model.name + "恭喜你又老了一歲";
		$window.plugins.emailComposer.showEmailComposer(subject, message, [$scope.model.email], [], [], true, []);
		//$window.open('mailto:' + $scope.model.email + '?subject=' + subject + '&body=' + message);
	};

	$scope.newFriendsButton = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus'></i>",
		tap: $scope.setFriendsFromContacts
	}];
});