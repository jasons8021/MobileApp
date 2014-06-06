app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "FinalAppDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, email TEXT, birthday DATE, isMember BOOLEAN, eventId TEXT default '')", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS messageLog(MsgId INTEGER PRIMARY KEY,senderPhone TEXT, receiverPhone TEXT, message TEXT, messageTime DATE, hasRead BOOLEAN)", []);
        });
    });
    
    return {
        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, email, birthday, isMember) VALUES (?, ?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember],
	                    function(tx, res) {
	                		friend.id = res.insertId;
	                		console.log('新增朋友成功, fid : ' + friend.id);
	                        (onSuccess || angular.noop)();
	                    }, function (e) {
	                        console.log('新增朋友失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify(friend));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },
        
        updateFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function (tx) {
	                tx.executeSql("UPDATE friends SET name = ?, phone = ?, email = ?, birthday = ?, isMember = ?, eventId = ? where id = ?",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember, friend.eventId, friend.id],
	                    onSuccess,
	                    onError
	                );
	            });
        	});
        },
        
        deleteFriend: function (friendID, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("delete from friends where id = ?", [friendID],
	                	onSuccess,
	                    onError
	                );
	            });
        	});
        },
        
        getFriends: function (onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM friends", [],
	        			onSuccess,
        				onError
    				);
            	});
            });
        },

        saveMessage: function (messageLog, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {//msgId, senderPhone, receiverPhone, message, time, hasRead
	                tx.executeSql("INSERT INTO messageLog(MsgId, senderPhone, receiverPhone, message, messageTime, hasRead) VALUES (?, ?, ?, ?, ?, ?)",
	                    [messageLog.MsgId, messageLog.senderPhone, messageLog.receiverPhone, messageLog.message, messageLog.messageTime, messageLog.hasRead],
	                    function(tx, res) {
	                		console.log("DB saveMessage 成功，訊息：" + messageLog.message + ", messageLog.MsgId" + messageLog.MsgId + ", MessageManager.receiverPhone：" + messageLog.receiverPhone + ", MessageManager.hasRead" + messageLog.hasRead);
	                        (onSuccess || angular.noop)();
	                    }, function (e) {
	                        console.log('DB saveMessage 失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify(messageLog));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },

        readMessage: function (messageLog, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function (tx) {
	                tx.executeSql("UPDATE messageLog SET hasRead = ? where MsgId = ?",
	                	[true, messageLog.MsgId],
	                    function(tx, res) {
	                		messageLog.hasRead = true;
	                        (onSuccess || angular.noop)();
	                    },
	                    onError
	                );
	            });
        	});
        },

        deleteMessage: function (messageLog, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("delete from messageLog where MsgId = ?", [messageLog.MsgId],
	                	onSuccess,
	                    onError
	                );
	            });
        	});
        },

        getMessage: function (onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM messageLog", [],
	        			onSuccess,
        				onError
    				);
            	});
            });
        },

        getMessageById: function (messageLogId, onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM messageLog where MsgId = ?", [messageLogId],
	        			onSuccess,
        				onError
    				);
            	});
            });
        }
    };
});

app.factory('FriendManager', function(DBManager, webServiceMember, $window) {
	var idIndexedFriends = {};
	var phoneIndexedFriends = {};

	if (!$window.localStorage['friend'])
		$window.localStorage['friend'] = "{}";

	DBManager.getFriends(function(tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			res.rows.item(i).isMember = JSON.parse(res.rows.item(i).isMember);
			idIndexedFriends[res.rows.item(i).id] = res.rows.item(i);
			phoneIndexedFriends[res.rows.item(i).phone] = res.rows.item(i);
		}
	});
	return {
		add: function(friend, onSuccess, onError) {
			webServiceMember.isMember(friend.phone, function(response) {
				friend.isMember = JSON.parse(response);
				DBManager.addFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
					(onSuccess || angular.noop)();
				}, onError);
			}, function() {
				friend.isMember = false;
				DBManager.addFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
					(onSuccess || angular.noop)();
				}, onError);
			});
		},
		edit: function(friend, onSuccess, onError) {
			webServiceMember.isMember(friend.phone, function(response) {
				friend.isMember = JSON.parse(response);
				DBManager.updateFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
					(onSuccess || angular.noop)();
				}, onError);
			}, function() {
				friend.isMember = false;
				DBManager.updateFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
					(onSuccess || angular.noop)();
				}, onError);
			});
		},
		remove: function(friendID, onSuccess, onError) {
			DBManager.deleteFriend(friendID, function() {
				delete idIndexedFriends[friendID];
			}, onError);
		},
		getById: function(id) {
			return idIndexedFriends[id];
		},
		getByPhone: function(phone) {
			return phoneIndexedFriends[phone];
		},
		list: function() {
			return idIndexedFriends;
		},
		count: function() {
			return Object.keys(idIndexedFriends).length;
		},
		setFriend: function(friend) {
			$window.localStorage['friend'] = JSON.stringify(friend);
		},
		getFriend: function() {
			return JSON.parse($window.localStorage['friend']);
		}
	};
  
});

app.factory('SettingManager', function($window) {
	if (!$window.localStorage['host'])
		$window.localStorage['host'] = "{}";
	var host = JSON.parse($window.localStorage['host']);
	return {
		setHost: function(newHost) {
			for (var i in newHost)
				host[i] = newHost[i];
			$window.localStorage['host'] = JSON.stringify(host);
		},
		getHost: function() {
			return host;
		}
	};
});

app.factory('ChatManager', function(DBManager, SettingManager) {

	var messageLogs = {};
	var host = SettingManager.getHost();
	var unlogMsgIds = {};

	var getPhone = function(message) {
		if (message.senderPhone == host.phone)
			return message.receiverPhone;
		return message.senderPhone;
	};

	var checkMessage = function(message) {
		var result = null;
		var phone = getPhone(message);
		var chatMessages = messageLogs[phone];
		for (var i in chatMessages) {
			if (chatMessages[i].MsgId == message.MsgId)
				result = chatMessages[i];
		}
		return result;
	};
	
	DBManager.getMessage(function(tx, res) {
		console.log('ChatManager newHost: ' + host.phone);
		for (var i = 0, max = res.rows.length; i < max; i++) {
			console.log(JSON.stringify(res.rows.item(i)));
			res.rows.item(i).hasRead = JSON.parse(res.rows.item(i).hasRead);
			var phone = getPhone(res.rows.item(i));
			console.log('ChatManager phone: ' + phone);
			if(!messageLogs[phone])
				messageLogs[phone] = [];
			messageLogs[phone].push(res.rows.item(i));
			if(messageLogs[phone])
				console.log('ChatManager messageLogs[phone]: ' + messageLogs[phone].message);
		}
	});
	return {
		getFriendPhone: getPhone,
		send: function(message, onSuccess, onError) {
			if (unlogMsgIds[message.MsgId]) {
				console.log('take unlogMsgIds' + message.MsgId);
				message.hasRead = true;
				delete unlogMsgIds[message.MsgId];
			}
			DBManager.saveMessage(message, function() {
				console.log('chatManager add 成功: ' + JSON.stringify(message));
				var phone = getPhone(message);
				if (!messageLogs[phone])
					messageLogs[phone] = [];
				messageLogs[phone].push(message);
                (onSuccess || angular.noop)();
			}, onError);
		},
		read : function(message, onSuccess, onError) {
			console.log('db read');
			var MsgId = message.MsgId;
			message = checkMessage(message);
			if (!message) {
				console.log('unlogMsgIds' + MsgId);
				unlogMsgIds[MsgId] = true;
				return;
			}
			DBManager.readMessage(message, function() {console.log('db success');}, onError);
		},
		remove: function(phone, onSuccess, onError) {
			DBManager.deleteMessage(phone, function() {
				delete messageLogs[phone];
                (onSuccess || angular.noop)();
			}, onError);
		},
		list: function() {
			return messageLogs;
		},
		get: function(phone) {
			if (!messageLogs[phone])
				messageLogs[phone] = [];
			return messageLogs[phone];
		},
		count: function() {
			return Object.keys(messageLogs).length;
		}
		
	};
});

app.factory('RestaurantManager', function($window) {
	if (!$window.localStorage['restaurant'])
		$window.localStorage['restaurant'] = "{}";
	return {
		setRestaurant: function(restaurant) {
			$window.localStorage['restaurant'] = JSON.stringify(restaurant);
		},
		getRestaurant: function() {
			return JSON.parse($window.localStorage['restaurant']);
		},
		clearLocalStorage: function(){
			$window.localStorage['restaurant'] = "{}";
		}
	};
});