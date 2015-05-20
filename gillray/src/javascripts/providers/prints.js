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