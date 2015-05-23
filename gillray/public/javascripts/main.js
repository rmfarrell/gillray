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
gillray.service('subjects', ['$http', '$q', function($http, $q) {

	this.add = function(subject) {

		var defer = $q.defer();

		$http.post('/api/admin/subjects/new', {subject: subject}).success(function(data) {

			defer.resolve(data)
		})

		return defer.promise;
	};

	this.remove = function(_id) {

		var defer = $q.defer();

		$http.post('/api/admin/subjects/remove', {id: _id}).success(function(data, status) {

			defer.resolve(status);
		})

		return defer.promise;
	}

	this.update = function(subject) {

		var defer = $q.defer();

		console.log(subject)

		$http.post('/api/admin/subjects/update/' + subject._id, {subject: subject}).success(function(data) {

			defer.resolve(data);
		});

		return defer.promise;
	};

	this.getAll = function() {

		var defer = $q.defer();

		$http.get('/api/admin/subjects').success(function(data) {

			defer.resolve(data);
		})

		return defer.promise;
	};
}]);
gillray.service('tags', ['$http', '$q', function($http, $q) {

	this.add = function(tag) {

		var defer = $q.defer();

		$http.post('/api/admin/tags/new', {tag: tag}).success(function(data) {
			defer.resolve(data)
		})

		return defer.promise;
	};

	this.remove = function(_id) {

		var defer = $q.defer();

		$http.post('/api/admin/tags/remove', {id: _id}).success(function(data, status) {

			defer.resolve(status);
		})

		return defer.promise;
	}

	this.getAll = function() {

		var defer = $q.defer();

		$http.get('/api/admin/tags').success(function(data) {

			defer.resolve(data);

		})

		return defer.promise;
	};
}]);
gillray.controller('admin-edit', ['$scope', '$rootScope', 'tags', 'subjects', function($scope, $rootScope, tags, subjects) {
	
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
	
	$scope.tags = [];

	updateTags();

	updateSubjects();

	$scope.tempModels = {};


	//Add/Remove tags
	$scope.addTag = function(tag) {

		tags.add(tag).then(updateTags)
	};
		
	$scope.removeTag = function(item, collection) {

		if (window.confirm("Delete " + item.name + "?")) tags.remove(item._id).then(updateTags);
	};

	//Add/Remove Subjects
	$scope.addSubject = function(subject) {

		subjects.add(subject).then(updateSubjects)
	};

	$scope.updateSubject = function(subject) {

		console.log(subject)

		subjects.update(subject).then(updateSubjects)
	};

	$scope.removeSubject = function(subject) {

		if (window.confirm("Delete " + subject.name + "?")) subjects.remove(subject._id).then(updateSubjects)
	};


	function updateSubjects() {

		subjects.getAll().then(function(data) {

			$scope.subjects = data;

			$scope.tempModels = {};
		})
	}

	//Private methods
	function updateTags() {

		tags.getAll().then(function(data) {

			$scope.tags = data;

			$scope.tempModels = {};
		})
	}
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