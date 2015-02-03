var cargoApp = angular.module('cargoApp', []);

cargoApp.controller('MainCtrl', [

	'$scope', '$http', '$timeout',

	function ($scope, $http, $timeout){

		var preventWatch = false;
		var theTo; 

		$scope.sendCreate = function(){

			 if(theTo) $timeout.cancel(theTo);

			 $scope.responseLines = [];

			$http.post('/api/create', {
				name: $scope.cargoName, 
				popitInstance: $scope.popitInstance
			}).then(function(res){

				//Start watching:
				preventWatch = false;
				watchResponse($scope.cargoName);
				theTo = $timeout(function(){ preventWatch = true; }, 180 * 1000);

			}).catch(function(err){
				alert('error creating');
			});

		};

		function watchResponse(instanceName){

			$http.get('/api/currentbuildstatus/' + instanceName).then(function(res){
				$scope.responseLines = res.data.log;
				if( ! preventWatch ){
					theTo = $timeout(function(){ watchResponse(instanceName); }, 1000);
				}
			});

		}


}]);
