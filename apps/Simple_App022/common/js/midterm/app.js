var app = angular.module("Simple_App022", ['ionic', 'PhoneGap','midtermApp']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/midterm/tab.html"
        })
        .state('tab.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/midterm/friends.html',
                    controller: 'FriendsCtrl'
                }
            }
        })
        .state('tab.chatList', {
            url: '/chatList',
            views: {
                'tab-chatList': {
                    templateUrl: 'templates/midterm/chatList.html',
                    controller: 'ChatListCtrl'
                }
            }
        })
        .state('tab.add', {
            url: '/add',
            views: {
                'tab-add': {
                    templateUrl: 'templates/midterm/add.html',
                    controller: 'AddCtrl'
                }
            }
        })
        .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/midterm/setting.html',
                    controller: 'SettingCtrl'
                }
            }
        })
        .state('tab.publish', {
            url: '/publish',
            views: {
                'tab-publish': {
                    templateUrl: 'templates/midterm/publish.html',
                    controller: 'PublishCtrl'
                }
            }
        })
        .state('editFriends', {
            url: '/editFriends',
            templateUrl: 'templates/midterm/editFriends.html',
            controller: 'EditFriendsCtrl'
        })
        .state('chat', {
            url: '/chat/:phone',
            templateUrl: 'templates/midterm/chat.html',
            controller: 'ChatCtrl'
        })
        .state('map', {
            url: '/map?latitude&longitude&friendName&isMe',
            templateUrl: 'templates/midterm/map.html',
            controller: 'MapCtrl'
        });

    $urlRouterProvider.otherwise("/tab/friends");
});

app.filter('fromNow', function() {
    return function(dateString) {
        return moment(dateString).fromNow();
    };
});

app.filter('removeLocation', function() {
    return function(messageString) {
        var result = messageString.replace(/^\([0-9.]+,[0-9.]+\)/, '');
        if (!result)
            return '顯示地圖';
        return result;
    };
});

app.run(function(DBManager, SettingManager, PushNotificationsFactory, iLabMessage, $window, PhoneGap, $rootScope, FriendManager, ChatManager) {
    var host = SettingManager.getHost();
    
    PhoneGap.ready(function() {
        if(host.phone){
            $window.document.addEventListener("pause", function(){
                iLabMessage.resetCounter(host.phone);
            }, false);
        }
    });
    
    $window.receiveMessage = function(payload) {
        console.log('收到一則新訊息: ' + payload);
        var message = JSON.parse(payload);
        if(!message)
        {
            console.log('message is null');
            return;
        }
        console.log('receiveMessage : payload拆解出來的message訊息' + message);
        //var friend = FriendManager.getByPhone(ChatManager.getFriendPhone(message));
        var friend = FriendManager.getByPhone(message.senderPhone);
        console.log('receiveMessage : senderPhone: ' + message.senderPhone);
        if (friend)
            console.log('receiveMessage : friend.name: ' + friend.name);

        if (friend || host.phone == message.senderPhone  || host.publisherId == message.senderPhone) {
            console.log('receiveMessage:' + message.message + ' ,  hasRead:' + message.hasRead);
            if (!message.hasRead){          
                ChatManager.send(message, function() {
                    $rootScope.$broadcast('receivedMessage',message);
                    $rootScope.$apply();
                });
            }
            else {
                ChatManager.read(message, function() {
                    $rootScope.$broadcast('receivedMessage',message);
                    $rootScope.$apply();
                });
            }
        } else console.log('receiveMessage: 沒朋友');
    };

    if (host.registered) {
        PhoneGap.ready(function() {     
            $window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, host.phone, host.phone);
        });
    }
    
    var GCMSENDERID = '325215294371';
    
    PushNotificationsFactory(GCMSENDERID, function(token, type) {
        var host = SettingManager.getHost();
        host.token = token;
        if (type == "GCM")
            host.type = 0;
        else if (type == "APNS")
            host.type = 1;
        SettingManager.setHost(host);
    });
    
    moment.lang('zh-tw');
});