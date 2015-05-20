gillray.controller('single', ['$scope', 'prints', function($scope, prints) {
	
	function getId() {
		
		var urlParts = window.location.pathname.split('/');
		
		var idIndex = urlParts.indexOf('edit') + 1
		
		return parseInt(urlParts[idIndex]) || false;
	}
	
	$scope.all = $scope;
	
	$scope.print ={
		
		bohnID: null,
		title: "",
		date: null,
		
		//Content
		images: [],
		description: "",
		transcription: "",
		
		//Ancillary
		subjects: [],
		tags: [],
		collections: [],
		sources: []
	}
	
	var printID = getId();
	
	if (printID) {
		
			prints.getPrint(getId()).then(function(data) {
		
			$scope.print = data[0];
		})
	}
	
	//Add items to array iteratively (e.g., images, subjects, tags)
	$scope.addItem = function(val, collection) {
		
		if (val.length < 1) return false;
		
		if ($scope.print[collection].indexOf(val) == -1) $scope.print[collection].push(val);
	}
	
	//Delete items from an array
	$scope.deleteItem = function(item, collection) {
		
		$scope.print[collection].splice($scope.print[collection].indexOf(item), 1);
	};
	
	$scope.submitEdits = function(e) {
		
	}
}]);