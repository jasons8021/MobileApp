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
        .state('test', {
            url: "/test",
            templateUrl: "templates/midterm/test.html"
        })
        .state('editFriends', {
            url: '/editFriends',
            templateUrl: 'templates/midterm/editFriends.html',
            controller: 'EditFriendsCtrl'
        })
        .state('chatRoom', {
            url: '/chatRoom',
            templateUrl: 'templates/midterm/chatRoom.html',
            controller: 'ChatRoomCtrl'
        });

    $urlRouterProvider.otherwise("/tab/friends");
});

app.run(function(DBManager, SettingManager, MessageManager, PushNotificationsFactory, iLabMessage, $window, PhoneGap, $rootScope) {
    var host = SettingManager.getHost();
    
    PhoneGap.ready(function() {
        if(host.phone)
        $window.document.addEventListener("pause", function(){
            iLabMessage.resetCounter(host.phone);
        }, false);
    });
    
    $window.receiveMessage = function(message) {
        console.log("receiver message : " + message);
        var deliveryMessage = {};
        if(message.indexOf(':') < 0)
            return;
        var splitedMessage = message.split(":");
        // $rootScope.$broadcast('mqtt.notification', splitedMessage[1]+splitedMessage[2]);
        console.log("receiver splitedMessage 0: " + splitedMessage[0]);
        console.log("receiver splitedMessage 1: " + splitedMessage[1]);
        console.log("receiver splitedMessage 2: " + splitedMessage[2]);
        deliveryMessage.message = splitedMessage[2];
        deliveryMessage.senderPhone = SettingManager.getHost().phone;
        deliveryMessage.receiverPhone = splitedMessage[0];
        deliveryMessage.messageTime = Date.now();

        MessageManager.send(deliveryMessage);

        $rootScope.$broadcast('mqtt.notification', splitedMessage[1]+splitedMessage[2]);
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
});

