
/* JavaScript content from js/03_hybrid/helloPhoneGapCtrl.js in folder common */
app.controller('HelloPhoneGapCtrl',
	function($scope){
		$scope.init = function(){
			$scope.phoneOS = "請輸入手機作業系統";
		};
			
		$scope.clear = function(){
			$scope.phoneOS = "";
		};
});