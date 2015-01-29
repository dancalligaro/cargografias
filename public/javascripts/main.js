var cargoApp = angular.module('cargoApp', []);

cargoApp.controller('MainCtrl', [
	'$scope', '$http', '$timeout',
	function ($scope, $http, $timeout){
	
	$scope.sendCreate = function(){

		console.log('creating');
		
		$http.post('/api/create', {
			name: $scope.cargoName
		}).then(function(res){
			console.log('ok', res);
		}).catch(function(err){
			alert('error creating');
		});

	};

}])