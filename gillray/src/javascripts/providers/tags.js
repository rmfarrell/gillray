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