app.controller('ChatListCtrl', function($scope, ChatManager, $window, FriendManager, $state, $ionicLoading, $http){
	$scope.friends = FriendManager.list();
	$scope.messages = ChatManager.list();
	
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

	$scope.getCount = function() {
		return FriendManager.count();
	};
	
	$scope.toURL = function(phone) {
		$state.go('chat',{
			phone:phone,
			latlng:null
		});
	};
	
	$scope.getUnread = function(friend) {
		var phone = friend.phone;
		var s = 0;
		var messages = ChatManager.get(phone);
		for(var index in messages) {
			var message = messages[index];
			if(message.senderPhone == phone && !message.hasRead) {
				s++;
			} else  {
				friend.lastMessage = message.time;
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

	function setEvent(friend) {
		if(!friend.eventId){
			$scope.show();
			var startDate = new Date(friend.birthday);
			var now = new Date();
			var nowEnd = new Date();
			now.setMinutes(now.getMinutes() + 6);
			nowEnd.setMinutes(nowEnd.getMinutes() + 66);
			startDate.setFullYear(now.getFullYear());
			if (startDate < now)
				startDate.setFullYear(now.getFullYear() + 1);
			var endDate = new Date(startDate.getTime());
			endDate.setHours(endDate.getHours()+1);
			gapi.client.load('calendar', 'v3', function() {
				var list = gapi.client.calendar.calendarList.list({
					minAccessRole: 'writer'
				});
				list.execute(function(resp) {
					var calendarId = resp.items[0].id;
					var insert = gapi.client.calendar.events.insert({
						calendarId: calendarId,
						resource: {
							summary: friend.name + '的生日',
							location: '請記得發送祝福',
							start: {
								dateTime: startDate,
								timeZone: "Asia/Taipei"
							},
							end: {
								dateTime: endDate,
								timeZone: "Asia/Taipei"
							},
							recurrence: ["RRULE:FREQ=YEARLY"],
							reminders: {
								useDefault: false,
								overrides: [{
									method: 'popup',
									minutes: 1440
								}]
							}
						}
					});
					insert.execute(function(resp) {
						console.log(JSON.stringify(resp));
						friend.eventId = resp.id;
						FriendManager.edit(friend);
						$scope.hide();
					});
					
					
					insert = gapi.client.calendar.events.insert({
						calendarId: calendarId,
						resource: {
							summary: friend.name + '的生日',
							location: '請記得發送祝福',
							start: {
								dateTime: now,
								timeZone: "Asia/Taipei"
							},
							end: {
								dateTime: nowEnd,
								timeZone: "Asia/Taipei"
							},
							reminders: {
								useDefault: false,
								overrides: [{
									method: 'popup',
									minutes: 3
								}]
							}
						}
					});
					insert.execute(function(resp) {
						$scope.hide();
					});
				});
			});
		} else {
			gapi.client.load('calendar', 'v3', function() {
				var list = gapi.client.calendar.calendarList.list({
					minAccessRole: 'writer'
				});
				list.execute(function(resp) {
					var calendarId = resp.items[0].id;
					var remove = gapi.client.calendar.events.delete({
						calendarId: calendarId,
						eventId: friend.eventId
					});
					remove.execute(function(resp) {
						console.log(JSON.stringify(resp));
						friend.eventId = '';
						FriendManager.edit(friend);
						$scope.hide();
					});
				});
			});
		};
	}
	
	$scope.onSetEventClick = function(friend) {
		if (gapi.auth.getToken()) {
			setEvent(friend);
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
							setEvent(friend);
						});
					});
				}
			});
		}
	};
});