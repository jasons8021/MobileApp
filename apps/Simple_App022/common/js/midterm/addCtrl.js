app.controller('AddCtrl', function($scope, FriendManager, SettingManager, Contacts, Notification, $window, $ionicLoading, $location, $http) {

	$scope.model = {};
    $scope.host = SettingManager.getHost();

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

	$scope.init = function() {

    };
    
	$scope.onCreateClick = function() {
		if (!$scope.model.name || !$scope.model.phone) {
			Notification.alert("請輸入姓名及電話", null, '警告', '確定');
			return;
		}
		FriendManager.add($scope.model, $scope.$apply);
		$scope.model = {};
		$location.url('/tab/friends');
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
    };
	
    $scope.setFriendsFromFB = function() {
        $scope.show();
        $window.openFB.login('user_friends', function() {
            $window.openFB.api({
                path: '/me/friends',
                success: function(response) {
                    var friendList = response.data;
                    for(var i = 0, max = friendList.length; i < max; i++) {
                        var friend = {
                                name: friendList[i].name,
                                phone: null,
                                email: "",
                                birthday: friendList[i].birthday
                        };
                        console.log(JSON.stringify(friend));
                        FriendManager.add(friend, $scope.$apply);
                    }
                    $scope.hide();
                },
                error: function(error) {
                    $scope.hide();
                    Notification.alert("存取好友名單失敗", null, '警告', '確定');
                }
            });
        },
        function(error) {
            $scope.hide();
            Notification.alert("未授權Facebook應用程式", null, '警告', '確定');
        });
    };
    
    function getDriveFile() {
        $scope.show();
        gapi.client.load('drive', 'v2', function() {
            var list = gapi.client.drive.files.list();
            var addressBook = 'friends.csv';
            list.execute(function(resp) {
                for (var i = 0; i < resp.items.length; i++) {
                    if (resp.items[i].title == addressBook) {
                        $http.get(resp.items[i].webContentLink).success(function(data, status, headers, config) {
                            var lines = data.split('\r\n');
                            for (var i = 1, max = lines.length; i < max; i++) {
                                var freindItems = lines[i].split(',');
                                var friend = {
                                        name: freindItems[0],
                                        phone: freindItems[1],
                                        email: freindItems[2],
                                        birthday: freindItems[3]
                                };
                                FriendManager.add(friend, $scope.$apply);
                            }
                        });
                        $scope.hide();
                        return;
                    }
                }
                $scope.hide();
                Notification.alert("存取" + addressBook + "失敗", null, '警告', '確定');
            });
        });
    }
    
    $scope.setFriendsFromGoogleDrive = function() {
        if (gapi.auth.getToken()) {
            getDriveFile();
        } else {
            liquid.helper.oauth.authorize(function(uriLocation) {
                var oAuth = liquid.helper.oauth;
                if (oAuth.authCode) {
                    oAuth.saveRefreshToken({ 
                        auth_code: oAuth.authCode
                    }, function() {
                        liquid.helper.oauth.getAccessToken(function(tokenObj) {
                            console.log('Access Token >> ' + tokenObj.access_token);
                            gapi.auth.setToken({
                                access_token: tokenObj.access_token
                            });
                            getDriveFile();
                        });
                    });
                }
            });
        }
    };

});