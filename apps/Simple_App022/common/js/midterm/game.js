app.controller('GameCtrl', function($scope, webServiceRestaurant, $window, $timeout, $rootScope){

	$scope.button = {};
	$scope.button.text = "Start";
	$scope.restaurant = {};
	$scope.restaurant.name = "請按下Start";

	var isRun = true;
	var restaurantList = [];	
	var chosedRestaurant = [];

	function getRestaurantList() {
    	webServiceRestaurant.getRestaurantList(function(response) {
            console.log('response : ' + response);
            for(var i in response)
            {
            	var restaurantInfo = response[i];
                console.log('i : ' + i + '名稱 : ' + restaurantInfo.name + ', 地址 : ' + restaurantInfo.address + ', 經緯度 : ' + restaurantInfo.latlng);
                restaurantList.push(restaurantInfo);
            }
        },function() {
            console.log('error');
        });
    }

	function run(){
		var i = Math.floor(Math.random() * restaurantList.length+ 1)-1;
		$scope.restaurant.name = restaurantList[i].name;

		if(isRun == false){
			// var notBeChosen = true;
			// for(var j in chosedRestaurant) {
			// 	if(chosedRestaurant[j] == i) {
			// 		notBeChosen = false;
			// 	}
			// }
			// if(notBeChosen){
			//  	chosedRestaurant[chosedRestaurant.length] = i;
			// 	return;
			// }
			return;
		}
		// $scope.$apply();

		$timeout(run, 10);
	}


	$scope.init = function(){
		getRestaurantList();
	}

	$scope.action = function() {
		if($scope.button.text == "Start"){
			isRun = true;
			$scope.button.text = "Stop";
			run();
		}else{
			isRun = false;
			$scope.button.text = "Start";
		}
	};

});