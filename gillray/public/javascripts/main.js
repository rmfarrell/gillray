var gillray = angular.module('gillray',[]);
gillray.service('prints', ['$q', '$http', function($q, $http) {
	
	this.getPrint = function(id) {
		
		var url = '/api/print/' + id;
		
		var deferred = $q.defer();
		
		$http.get(url).success(function(data) {
			
			data[0].bohnID = parseInt(data[0].bohnID);
			
			deferred.resolve(data);
			
		}).error(function(err) {
			
			console.log(err)
		});
		
		return deferred.promise;
	};
}]);
gillray.controller('admin-edit', ['$scope', '$rootScope', function($scope, $rootScope) {
	
	$scope.subjects = [
		{
			name: "Name 1",
			wikipedia: "",
			id: "123"
		},
		{
			name: "Name 2",
			wikipedia: "",
			id: "111"
		}
	];
	
	$scope.tags = [
		'Political',
		'Suppressed'
	]
			
	$scope.newSubject = {};
	
	$scope.newTag = {};
	
	$scope.newTag.name = "";
		
	$scope.removeItem = function(item, collection) {
		
		return collection.splice(collection.indexOf(item), 1);
	};
	
	$scope.addItem = function(item, collection) {
		
		console.log($scope.newTag)
		
		collection.push(item);
		
		$scope.newSubject = {};
		
		$scope.newTag.name = "";
		
		console.log($scope.newTag)
	};
	
	$scope.submit = function () {
		
		alert('test');
	};
}]);
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
		
	}
}]);