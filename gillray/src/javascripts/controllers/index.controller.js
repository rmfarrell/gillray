gillray.controller('index', ['$scope', 'prints', function($scope, prints) {
	
	
	$scope.prints = [];
	
	prints.getIndex().then(function(data) {
		
		$scope.prints = data
	})
	
	$scope.sortCritera = {
		date: null,
		title: null
	}
	
	$scope.$watchCollection('sortCritera', function(newVal, oldVal) {
		
		console.log($scope.sortCritera)
	});
}]);