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