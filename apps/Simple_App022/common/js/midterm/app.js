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
        if(!dateString)
            return;
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

app.filter('afterDay', function() {
    return function(dateString) {
        if (!dateString)
            return '未知';
        var birthday = new Date(dateString);
        var now = moment().startOf('day').toDate();
        birthday.setFullYear(now.getFullYear());
        if (birthday < now)
            birthday.setFullYear(now.getFullYear() + 1);
        var span = now.dateDiff(birthday, 'd');
        if (span == 0)
            return '今天';
        return span + '天後';
    };
});

app.filter('sortBy', function () {
    return function (items, method) {
        var result = [];
        angular.forEach(items, function (value, key) {
             result.push(value);
        });
        
        var birthday = function(a, b) {
            if(!a.birthday)
                return 1;
            if(!b.birthday)
                return -1;
             var d1 = new Date(a.birthday);
             var d2 = new Date(b.birthday);
             var now = moment().startOf('day').toDate();
             d1.setFullYear(now.getFullYear());
             if (d1 < now)
                 d1.setFullYear(now.getFullYear() + 1);
             d2.setFullYear(now.getFullYear());
             if (d2 < now)
                 d2.setFullYear(now.getFullYear() + 1);
             if (d1 > d2)
                return 1;
             if (d1 < d2)
                return -1;
             return 0;
         };
         
         var message = function(a, b) {
            if(!a.lastMessage && !b.lastMessage)
                return birthday(a,b);
            if(!a.lastMessage)
                return 1;
            if(!b.lastMessage)
                return -1;
             var d1 = new Date(a.lastMessage);
             var d2 = new Date(b.lastMessage);
             if (d1 > d2)
                return -1;
             if (d1 < d2)
                return 1;
             return 0;
         };
        if(method == 'birthday') {
            result.sort(birthday);
        }
        else if (method == 'message') {
            result.sort(message);
        }
        return result;
    };
});

app.filter('reverseArray', function () {
    return function (array) {
        return [].concat(array).reverse();;
    };
});

app.run(function(DBManager, SettingManager, PushNotificationsFactory, iLabMessage, $window, PhoneGap, $rootScope, FriendManager, ChatManager) {
    Date.prototype.dateDiff = function(objDate, interval){
        var dtEnd = new Date(objDate);
        if(isNaN(dtEnd)) return undefined;
        switch (interval) {
            case "s":return parseInt((dtEnd - this) / 1000);  //秒
            case "n":return parseInt((dtEnd - this) / 60000);  //分
            case "h":return parseInt((dtEnd - this) / 3600000);  //時
            case "d":return parseInt((dtEnd - this) / 86400000);  //天
            case "w":return parseInt((dtEnd - this) / (86400000 * 7));  //週
            case "m":return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-this.getFullYear())*12) - (this.getMonth()+1);  //月份
            case "y":return dtEnd.getFullYear() - this.getFullYear();  //天
        }
    };
    
    var host = SettingManager.getHost();
    var fbAppId = '270369976420378';
    $window.openFB.init(fbAppId);
    
    // PhoneGap.ready(function() {
    //     if(host.phone){
    //         $window.document.addEventListener("pause", function(){
    //             iLabMessage.resetCounter(host.phone);
    //         }, false);
    //     }
    // });
    
    $window.receiveMessage = function(payload) {
        console.log('收到一則新訊息: ' + payload);
        var message = JSON.parse(payload);
        if(!message)
        {
            console.log('message is null');
            return;
        }
        console.log('receiveMessage : payload拆解出來的message訊息' + message);
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