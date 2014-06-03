app.controller('SettingCtrl',function($scope, $window, SettingManager, $ionicLoading, $http, Notification, iLabMember, iLabMessage){
    $scope.UNREGISTERED = 0;
    $scope.REGISTERED = 1;
    $scope.DELETE = 2;
    $scope.SUBSRCIPE;
    $scope.UNSUBSRCIPE;

    $scope.state = $scope.UNREGISTERED;

    $scope.show = function() {
          $scope.loading = $ionicLoading.show({
            content: "<i class='ion-loading-b'></i>",
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 500
          });
      };
      
      $scope.hide = function() {
        $scope.loading.hide();
      };

    $scope.init = function() {
        $scope.host = angular.copy(SettingManager.getHost());
        if ($scope.host.registered) {
            $scope.state = $scope.REGISTERED;
        }
    };
    
    $scope.onActionClick = function(STATE) {
        $scope.state = STATE;
    };

    $scope.onRegisterClick = function() {
        if(!$scope.host.phone || !$scope.host.name) {
            Notification.alert('請輸入電話及姓名', null, "通知");
            return;
        }
        console.log($window.device.uuid);
        
        $scope.show();
        iLabMember.register($scope.host,
            function() {
                $scope.hide();
                $scope.host.registered = true;
                Notification.alert('註冊成功', null, "通知");
                SettingManager.setHost($scope.host);
                $window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, $scope.host.phone, $scope.host.phone);
                $scope.state = $scope.REGISTERED;
            }, function() {
                $scope.hide();
                Notification.alert('註冊失敗', null, "警告");
      });
    };

    $scope.onDeleteClick = function() {
        $scope.show();
        iLabMember.unregister($scope.host.phone, 
            function(response) {
                $scope.host.name = "";
                $scope.host.phone = "";
                $scope.host.email = "";
                $scope.host.birthday = "";
                $scope.host.registered = false;
                SettingManager.setHost($scope.host);
                $scope.hide();
                $scope.state = $scope.UNREGISTERED;
            }, function() {
                $scope.hide();
                    Notification.alert('刪除失敗', null, "警告");
        });
    };

    $scope.onCancelClick = function() {
        $scope.state = $scope.REGISTERED;
    };

    $scope.getNetwork = function() {
        if (SettingManager.getHost().type == '0')
            return "GCM";
        return "APNS";
    };

    $scope.onSubscribeClick = function() {
        SettingManager.setHost($scope.host);
        Notification.alert('訂閱成功', null, "通知");
    };
      
    $scope.onUnsubscribeClick = function() {
        $scope.host.publisherId = "";
        $scope.host.publisherName = "";
        SettingManager.setHost($scope.host);
    };

    $scope.onFBRegisterClick = function() {
        $window.openFB.login('user_friends', function() {
            Notification.alert("已授權北科要吃啥", null, '消息', '確定');
            $scope.host.hasFB = true;
            SettingManager.setHost($scope.host);
        },
        function(error) {
            $scope.hide();
            Notification.alert("未授權北科要吃啥", null, '警告', '確定');
        });
    };
});