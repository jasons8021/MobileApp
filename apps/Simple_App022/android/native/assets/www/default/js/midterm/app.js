
/* JavaScript content from js/midterm/app.js in folder common */
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
        });

    $urlRouterProvider.otherwise("/tab/friends");
});

app.run(function(DBManager, SettingManager, PushNotificationsFactory, iLabMessage, $window, PhoneGap, $rootScope) {
    var host = SettingManager.getHost();
    
    PhoneGap.ready(function() {
        if(host.phone)
        $window.document.addEventListener("pause", function(){
            iLabMessage.resetCounter(host.phone);
        }, false);
    });
    
    $window.receiveMessage = function(message) {
        if(message.indexOf(':') < 0)
            return;
        $rootScope.$broadcast('mqtt.notification', message);
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