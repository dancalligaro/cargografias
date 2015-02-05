var cargoApp = angular.module('cargoApp', []);

cargoApp.controller('MainCtrl', [

	'$scope', '$http', '$timeout',

	function ($scope, $http, $timeout){

		$scope.sendCreate = function(){

			$scope.responseLines = [];

			$http.post('/api/create', {
				name: $scope.cargoName, 
				popitInstance: $scope.popitInstance
			}).then(function(res){

				//Start watching:
				watchResponse($scope.cargoName);
				
			}).catch(function(err){
				alert('error creating');
			});

		};

		function watchResponse(instanceName){

			$http.get('/api/currentbuildstatus/' + instanceName).then(function(res){
				
				$scope.responseLines = res.data.log;
				
				if(res.data.importStatus === 'creating'){
					$timeout(function(){ watchResponse(instanceName); }, 1000);
				}
				
			});

		}


}]);
