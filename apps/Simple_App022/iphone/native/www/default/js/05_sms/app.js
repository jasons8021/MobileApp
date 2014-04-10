
/* JavaScript content from js/05_sms/app.js in folder common */
var app = angular.module("Simple_App022", ['ionic', 'PhoneGap']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/05_sms/tab.html"
	    })
        .state('tab.helloSMS', {
            url: '/helloSMS',
            views: {
                'tab-helloSMS': {
                    templateUrl: 'templates/05_sms/helloSMS.html',
                    controller: 'HelloSMSCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise("/tab/helloSMS");
});
