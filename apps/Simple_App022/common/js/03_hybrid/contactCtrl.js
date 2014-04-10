app.controller('ContactCtrl',
	function($scope) {

        var contacts = [];

		// Create a Contact
		$scope.contactInit = function() {
			// Wait for device API libraries to load
			//
			document.addEventListener("deviceready", onDeviceReady, false);

			// device APIs are available
			//
			function onDeviceReady() {
			    var myContact = navigator.contacts.create({"displayName": "Test User"});
			    myContact.note = "This contact has a note.";
			    alert('The contact, ' + myContact.displayName + ', note: ' + myContact.note);
			    // console.log("The contact, " + myContact.displayName + ", note: " + myContact.note);
			}
		};

		$scope.contactFind = function(searchName){
            
			// Wait for device API libraries to load
            document.addEventListener("deviceready", onDeviceReady, false);
            
            // device APIs are available

            function onDeviceReady() {
                // find all contacts with 'Bob' in any name field
            	var options = new ContactFindOptions();
                options.filter = searchName;
                options.multiple  = true; 
                var fields = ["displayName"];
                navigator.contacts.find(fields, onSuccess, onError, options);
            }

            // onSuccess: Get a snapshot of the current contacts

            function onSuccess(contacts) {
                var showContactsLength = contacts.length;

                if ( showContactsLength > 5 )
                    showContactsLength = 5; 
                    
                for (var i = 0; i < showContactsLength; i++) {
                    alert('名字 : ' + contacts[i].displayName);
                    // contacts[i].phoneNumbers
                }
            }

            // // onError: Failed to get the contacts
            function onError(contactError) {
                alert('Not find in you contact!');
            }
            

		};
	}
);