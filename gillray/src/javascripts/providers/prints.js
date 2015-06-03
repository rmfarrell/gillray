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
	
	//Get index.json (no db query)
	this.getIndex = function() {
		
		var deferred = $q.defer();
		
		$http.get('/index.json').success(function(data) {
			
			deferred.resolve(data);
			
		}).error(function(err) {
			
			deferred.reject(err);
		})
		
		return deferred.promise;
	}
	
	this.new = function(printObj) {
		
		$http.post('/api/new', printObj).success(function(data) {
			
			console.log(data);
			
		}).error(function(err) {
			
			console.log(err);
		})
	}
}]);