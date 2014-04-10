
/* JavaScript content from js/03_hybrid/app.js in folder common */
var app = angular.module("Simple_App022",['ionic']);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('tab', {
			url : "/tab",
			abstract : true,
			templateUrl : "templates/03_hybrid/tab.html"
		})
		// .state('tab.hellophonegap', {
		// 	url : "/hellophonegap",
		// 	views : {
		// 		'tab-hellophonegap' : {
		// 			templateUrl : 'templates/03_hybrid/helloPhoneGap.html',
		// 			controller : 'HelloPhoneGapCtrl'
		// 		}
		// 	}
		// })
		.state('tab.contact', {
	    	url : '/contact',
	    	views : {
	    		'tab-contact' : {
	    			templateUrl : 'templates/03_hybrid/contact.html',
	    			controller : 'ContactCtrl'
	    		}
	    	}
	    });
	
	$urlRouterProvider.otherwise("/tab/contact");
});