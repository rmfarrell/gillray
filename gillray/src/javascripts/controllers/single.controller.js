gillray.controller('single', ['$scope', 'prints', 'tags', 'subjects', function($scope, prints, tags, subjects) {
	
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

	$scope.allTags = [];

	$scope.allSubjects = {
		names: [], //Record this separately for autocomplete to work
		subjects: []
	};

	tags.getAll().then(function(data) {

		$scope.allTags = data;
	});

	subjects.getAll().then(function(data) {

		$scope.allSubjects = data;
	})

	$scope.addSubject = function(subject) {
		
		$scope.print.subjects.push(subject);

		$scope.tempModels = {};
	}


	$scope.addTag = function(tag) {

		if ($scope.print.tags.indexOf(tag) === -1) $scope.print.tags.push(tag);

		$scope.tempModels = {};
	}
	
	var printID = getId();
	
	if (printID) {
		
			prints.getPrint(getId()).then(function(data) {
		
			$scope.print = data[0];
		})
	}
	
	$scope.tempModels = {}
	
	//Add items to array iteratively (e.g., images, subjects, tags)
	$scope.addItem = function(val, collection) {
		
		if (val.length < 1) return false;
		
		if ($scope.print[collection].indexOf(val) == -1) $scope.print[collection].push(val);

		$scope.tempModels = {}
	}
	
	//Delete items from an array
	$scope.deleteItem = function(item, collection) {
		
		$scope.print[collection].splice($scope.print[collection].indexOf(item), 1);
	};
	
	$scope.submitEdits = function(e) {
		
		e.preventDefault();
		
		prints.new($scope.print)
	}
}]);