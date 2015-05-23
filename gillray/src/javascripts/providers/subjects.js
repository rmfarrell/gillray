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