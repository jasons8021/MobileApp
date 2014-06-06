angular.module('midtermApp', ['PhoneGap']).factory('webServiceMessage', function ($http, $window, PhoneGap, $rootScope) {
	var iLabServiceUrl = 'http://iweb.csie.ntut.edu.tw:10080/apps22/api/Message';
	
	return {
    	sendMessage: function(deliveryMessage, onSucess) {
            
    		var send = $http({
                method: 'POST',
                url: iLabServiceUrl,
                data: deliveryMessage
            });
    		
    		send.success(function(response, status, headers, config){
    			console.log("sendMessage發送成功，原因:"+response);
                (onSucess || angular.noop)(response);
    		});
    		
    		send.error(function(response, status, headers, config) {
    		    console.log("sendMessage發送失敗，原因:"+response);
    		});
        },

        readMessage: function(msgId) {
            var send = $http({
                method: 'PUT',
                url: iLabServiceUrl,
                params: {
                    messageLogID: msgId
                }
            });
            
            send.success(function(response, status, headers, config){
                console.log("接收成功: " + response);
            });
            
            send.error(function(response, status, headers, config) {
                console.log("接收失敗，原因:"+response);
            });
        },
        
        resetCounter: function(phone) {
            var reset = $http({
                method: 'DELETE',
                url: iLabServiceUrl,
                params: {
                    phone: phone
                }
            });
            
            reset.success(function(response, status, headers, config){
                console.log("resetCounter發送成功");
            });
            
            reset.error(function(response, status, headers, config) {
                console.log("resetCounter發送失敗，原因:"+response);
            });
        }
    };
});


angular.module('midtermApp').factory('webServiceMember', function ($rootScope, $window, $http) {
	var iLabServiceUrl = 'http://iweb.csie.ntut.edu.tw:10080/apps22/api/Member';
	
	return {
        isMember: function(phone, onSuccess, onError) {
			var check = $http({
				method: 'GET',
				url: iLabServiceUrl,
				params: {phone: phone}
			});
			check.success(function(response, status, headers, config){
    			(onSuccess || angular.noop)(response);
    		});
			check.error(function (response, status, headers, config){
    			(onError || angular.noop)(false);
    		});
        },
	    
	    register: function(host, onSuccess, onError) {
	    	var hostData = {
                Name: host.name,
    			Phone: host.phone,
    			DeviceType: host.type,
    			DeviceToken: host.token
    		};
	        	
    		var add = $http({
    			method: 'POST',
    			url: iLabServiceUrl,
    			data: hostData
    		});
	    		
    		add.success(function(response, status, headers, config){
    			(onSuccess || angular.noop)(response);
    		});
	    		
    		add.error(function (response, status, headers, config){
    			(onError || angular.noop);
    		});
	    },
	    
	    unregister: function(phone, onSuccess, onError) {
        	var remove = $http({
    			method: 'DELETE',
    			url: iLabServiceUrl,
    			params: {
    				phone: phone
    			}
    		});
        	remove.success(function(response, status, headers, config){
    			(onSuccess || angular.noop)(response);
    		});
        	remove.error(function (response, status, headers, config){
    			(onError || angular.noop)(false);
    		});
        }
	};
});

angular.module('midtermApp').factory('webServiceRestaurant', function ($http, $window, PhoneGap, $rootScope) {
    var iLabServiceUrl = 'http://iweb.csie.ntut.edu.tw:10080/apps22/api/Restaurant';
    
    return {
        addRestaurant: function(restaurant, onSucess) {
            var add = $http({
                method: 'POST',
                url: iLabServiceUrl,
                data: restaurant
            });
            
            add.success(function(response, status, headers, config){
                console.log("addRestaurant發送成功，原因:"+response);
                (onSucess || angular.noop)(response);
            });
            
            add.error(function(response, status, headers, config) {
                console.log("addRestaurant發送失敗，原因:"+response);
            });
        },

        getRestaurantList: function(onSucess, onError) {
            var get = $http({
                method: 'GET',
                url: iLabServiceUrl
            });
            
            get.success(function(response, status, headers, config){
                console.log("addRestaurant發送成功，原因:"+response);
                (onSucess || angular.noop)(response);
            });
            
            get.error(function(response, status, headers, config) {
                console.log("addRestaurant發送失敗，原因:"+response);
                (onError || angular.noop);
            });
        }
    };
});