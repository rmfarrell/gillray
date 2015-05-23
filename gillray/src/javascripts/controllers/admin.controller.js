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