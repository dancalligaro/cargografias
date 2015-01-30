var cargoApp = angular.module('cargoApp', []);

cargoApp.controller('MainCtrl', [

	'$scope', '$http', '$timeout',

	function ($scope, $http, $timeout){
	
	$scope.sendCreate = function(){

		$http.post('/api/create', {
			name: $scope.cargoName, 
			popitInstance: $scope.popitInstance
		}).then(function(res){
			console.log('ok', res);
		}).catch(function(err){
			alert('error creating');
		});

	};

}]);
