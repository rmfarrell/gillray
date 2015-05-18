gillray.controller('single', ['$scope', function($scope) {
	
	$scope.all = $scope;
	
	$scope.print ={
		
		bohnID: null,
		title: "",
		date: null,
		
		//Content
		images: [],
		description: "",
		
		//Ancillary
		subjects: [],
		tags: [],
		collections: [],
		sources: []
	}
	
	$scope.addimage = function(val) {
		
		console.log(val)
		
		//ev.target.value = '';
		
		$scope.print.images.push(val);
	};
	
	$scope.deleteImage = function(item) {
		
		$scope.print.images.splice($scope.print.images.indexOf(item), 1);
	};
	
	$scope.submitEdits = function(e) {
		
		//e.preventDefault();
		
		console.log($scope.print)
	}
}]);