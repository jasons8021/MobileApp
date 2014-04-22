app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "MidtermAppDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, isMember BOOLEAN)", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS messageLog(id INTEGER PRIMARY KEY ASC, message TEXT, senderPhone TEXT , receiverPhone TEXT, messageTime DATE)", []);
        });
    });
    
    return {
        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, isMember) VALUES (?, ?, ?)",
	                    [friend.name, friend.phone, friend.isMember],
	                    function(tx, res) {
	                		friend.id = res.insertId;
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
	                tx.executeSql("UPDATE friends SET name = ?, phone = ?, isMember = ? where id = ?",
	                    [friend.name, friend.phone, friend.isMember, friend.id],
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

        sendMessage: function (deliveryMessage, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO messageLog(message, senderPhone, receiverPhone, messageTime) VALUES (?, ?, ?, ?)",
	                    [deliveryMessage.message, deliveryMessage.senderPhone, deliveryMessage.receiverPhone, deliveryMessage.messageTime],
	                    function(tx, res) {
	                		deliveryMessage.id = res.insertId;
	                		console.log("MessageManager.sendMessage成功，訊息：" + deliveryMessage.message + "MessageManager.receiverPhone：" + deliveryMessage.receiverPhone);
	                        (onSuccess || angular.noop)();
	                    }, function (e) {
	                        console.log('MessageManager.sendMessage失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify(deliveryMessage));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },

        deleteMessage: function (deliveryMessage, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("delete from messageLog where id = ?", [deliveryMessage.id],
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
    };
});

app.factory('FriendManager', function(DBManager, iLabMember, $window) {
	var idIndexedFriends = {};
	var phoneIndexedFriends = {};

	if (!$window.localStorage['friend'])
		$window.localStorage['friend'] = "{}";

	DBManager.getFriends(function(tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			idIndexedFriends[res.rows.item(i).id] = res.rows.item(i);
			console.log(idIndexedFriends[res.rows.item(i).id].isMember);
		}
	});
	return {
		add: function(friend, onSuccess, onError) {
			iLabMember.isMember(friend.phone, function(response) {
				friend.isMember = JSON.parse(response) ? 1 : 0;
				DBManager.addFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					(onSuccess || angular.noop)();
				}, onError);
			}, function() {
				friend.isMember = 0;
				DBManager.addFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					(onSuccess || angular.noop)();
				}, onError);
			});
		},
		edit: function(friend, onSuccess, onError) {
			iLabMember.isMember(friend.phone, function(response) {
				friend.isMember = response ? 1 : 0;
				DBManager.updateFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
					(onSuccess || angular.noop)();
				}, onError);
			}, function() {
				friend.isMember = 0;
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
			if (phoneIndexedFriends[phone] == undefined) {
				for (var id in idIndexedFriends) {
					if (idIndexedFriends[id].phone == phone) {
						phoneIndexedFriends[phone] = idIndexedFriends[id];
						break;
					}
				}
			}
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
	return {
		setHost: function(host) {
			$window.localStorage['host'] = JSON.stringify(host);
		},
		getHost: function() {
			return JSON.parse($window.localStorage['host']);
		}
	};
});

function getSRDialog(senderPhone, receiverPhone, idIndexedMessage) {
	var idIndexedDialog = {};
  	for (var mid in idIndexedMessage) {
		// console.log("check idIndexedMessage id : " + idIndexedMessage[mid].id);
		if((idIndexedMessage[mid].senderPhone == senderPhone && idIndexedMessage[mid].receiverPhone == receiverPhone) ||
		  (idIndexedMessage[mid].senderPhone == receiverPhone && idIndexedMessage[mid].receiverPhone == senderPhone))
		{ 
			idIndexedDialog[mid] = idIndexedMessage[mid];
			// console.log("getDialog.message = " + idIndexedMessage[mid].message);
		}
	}
	return idIndexedDialog;
}

app.factory('MessageManager', function(DBManager, FriendManager, SettingManager, iLabMember, $window) {
	var idIndexedMessage = {};
	var idIndexedDialog = {};
	var idIndexedLatestMessage = {};

	if (!$window.localStorage['HGPhone'])
		$window.localStorage['HGPhone'] = "{}";

	DBManager.getMessage(function(tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			idIndexedMessage[res.rows.item(i).id] = res.rows.item(i);
			// console.log("getMessage.id = " + idIndexedMessage[res.rows.item(i).id].id);
		}
	});
	return {
		send: function(deliveryMessage, onSuccess, onError) {
			DBManager.sendMessage(deliveryMessage, function() {
				idIndexedMessage[deliveryMessage.id] = deliveryMessage;
				(onSuccess || angular.noop)();
			}, onError);
		},
		remove: function(deliveryMessage, onSuccess, onError) {
			DBManager.deleteMessage(deliveryMessage, function() {
				delete idIndexedMessage[deliveryMessage.id];
			}, onError);
		},
		getById: function(id) {
			return idIndexedMessage[id];
		},
		list: function() {
			return idIndexedMessage;
		},
		count: function() {
			return Object.keys(idIndexedMessage).length;
		},
		getDialog: function(senderPhone, receiverPhone) {
			return getSRDialog(senderPhone, receiverPhone, idIndexedMessage);
		},
		getLatestMessage: function() {
			var friendList = FriendManager.list();

			for (var fid in friendList) {
					if (friendList[fid].isMember) {
					var tempDialog = getSRDialog(SettingManager.getHost().phone, friendList[fid].phone, idIndexedMessage);
					// Object.keys(tempDialog).length-1 是指在hash table的key set最後一個key, 例如[1,3,5,7], 最後一個就是7
					// console.log("fid : " + fid + ", getLatestMessage() tempDialog Object.keys last key : " + Object.keys(tempDialog)[Object.keys(tempDialog).length-1]);
					idIndexedLatestMessage[Object.keys(tempDialog)[Object.keys(tempDialog).length-1]] = tempDialog[Object.keys(tempDialog)[Object.keys(tempDialog).length-1]];
					// console.log("getLatestMessage() tempDialog id(message id) : " + tempDialog[Object.keys(tempDialog)[Object.keys(tempDialog).length-1]].id);
				};
			}

			return idIndexedLatestMessage;
		},
		setHGPhone: function(HGPhone) {
			$window.localStorage['HGPhone'] = JSON.stringify(HGPhone);
		},
		getHGPhone: function() {
			return JSON.parse($window.localStorage['HGPhone']);
		}
	};
});
