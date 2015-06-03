/**
 * Angucomplete
 * Autocomplete directive for AngularJS
 * By Daryl Rowland
 */

angular.module('angucomplete', [] )
    .directive('angucomplete', function ($parse, $http, $sce, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            "id": "@id",
            "placeholder": "@placeholder",
            "selectedObject": "=selectedobject",
            "url": "@url",
            "dataField": "@datafield",
            "titleField": "@titlefield",
            "descriptionField": "@descriptionfield",
            "imageField": "@imagefield",
            "imageUri": "@imageuri",
            "inputClass": "@inputclass",
            "userPause": "@pause",
            "localData": "=localdata",
            "searchFields": "@searchfields",
            "minLengthUser": "@minlength",
            "matchClass": "@matchclass"
        },
        template: '<div class="angucomplete-holder"><input id="{{id}}_value" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" onmouseup="this.select();" ng-focus="resetHideResults()" ng-blur="hideResults()" /><div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-if="showDropdown"><div class="angucomplete-searching" ng-show="searching">Searching...</div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)">No results found</div><div class="angucomplete-row" ng-repeat="result in results" ng-mousedown="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div ng-if="imageField" class="angucomplete-image-holder"><img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/><div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div></div><div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div><div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div></div>',

        link: function($scope, elem, attrs) {
            $scope.lastSearchTerm = null;
            $scope.currentIndex = null;
            $scope.justChanged = false;
            $scope.searchTimer = null;
            $scope.hideTimer = null;
            $scope.searching = false;
            $scope.pause = 500;
            $scope.minLength = 3;
            $scope.searchStr = null;

            if ($scope.minLengthUser && $scope.minLengthUser != "") {
                $scope.minLength = $scope.minLengthUser;
            }

            if ($scope.userPause) {
                $scope.pause = $scope.userPause;
            }

            isNewSearchNeeded = function(newTerm, oldTerm) {
                return newTerm.length >= $scope.minLength && newTerm != oldTerm
            }

            $scope.processResults = function(responseData, str) {
                if (responseData && responseData.length > 0) {
                    $scope.results = [];

                    var titleFields = [];
                    if ($scope.titleField && $scope.titleField != "") {
                        titleFields = $scope.titleField.split(",");
                    }

                    for (var i = 0; i < responseData.length; i++) {
                        // Get title variables
                        var titleCode = [];

                        for (var t = 0; t < titleFields.length; t++) {
                            titleCode.push(responseData[i][titleFields[t]]);
                        }

                        var description = "";
                        if ($scope.descriptionField) {
                            description = responseData[i][$scope.descriptionField];
                        }

                        var imageUri = "";
                        if ($scope.imageUri) {
                            imageUri = $scope.imageUri;
                        }

                        var image = "";
                        if ($scope.imageField) {
                            image = imageUri + responseData[i][$scope.imageField];
                        }

                        var text = titleCode.join(' ');
                        if ($scope.matchClass) {
                            var re = new RegExp(str, 'i');
                            var strPart = text.match(re)[0];
                            text = $sce.trustAsHtml(text.replace(re, '<span class="'+ $scope.matchClass +'">'+ strPart +'</span>'));
                        }

                        var resultRow = {
                            title: text,
                            description: description,
                            image: image,
                            originalObject: responseData[i]
                        }

                        $scope.results[$scope.results.length] = resultRow;
                    }


                } else {
                    $scope.results = [];
                }
            }

            $scope.searchTimerComplete = function(str) {
                // Begin the search

                if (str.length >= $scope.minLength) {
                    if ($scope.localData) {
                        var searchFields = $scope.searchFields.split(",");

                        var matches = [];

                        for (var i = 0; i < $scope.localData.length; i++) {
                            var match = false;

                            for (var s = 0; s < searchFields.length; s++) {
                                match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                            }

                            if (match) {
                                matches[matches.length] = $scope.localData[i];
                            }
                        }

                        $scope.searching = false;
                        $scope.processResults(matches, str);

                    } else {
                        $http.get($scope.url + str, {}).
                            success(function(responseData, status, headers, config) {
                                $scope.searching = false;
                                $scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData ), str);
                            }).
                            error(function(data, status, headers, config) {
                                console.log("error");
                            });
                    }
                }
            }

            $scope.hideResults = function() {
                $scope.hideTimer = $timeout(function() {
                    $scope.showDropdown = false;
                }, $scope.pause);
            };

            $scope.resetHideResults = function() {
                if($scope.hideTimer) {
                    $timeout.cancel($scope.hideTimer);
                };
            };

            $scope.hoverRow = function(index) {
                $scope.currentIndex = index;
            }

            $scope.keyPressed = function(event) {
                if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                    if (!$scope.searchStr || $scope.searchStr == "") {
                        $scope.showDropdown = false;
                        $scope.lastSearchTerm = null
                    } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                        $scope.lastSearchTerm = $scope.searchStr
                        $scope.showDropdown = true;
                        $scope.currentIndex = -1;
                        $scope.results = [];

                        if ($scope.searchTimer) {
                            $timeout.cancel($scope.searchTimer);
                        }

                        $scope.searching = true;

                        $scope.searchTimer = $timeout(function() {
                            $scope.searchTimerComplete($scope.searchStr);
                        }, $scope.pause);
                    }
                } else {
                    event.preventDefault();
                }
            }

            $scope.selectResult = function(result) {
                if ($scope.matchClass) {
                    result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                }
                $scope.searchStr = $scope.lastSearchTerm = result.title;
                $scope.selectedObject = result;
                $scope.showDropdown = false;
                $scope.results = [];
                //$scope.$apply();
            }

            var inputField = elem.find('input');

            inputField.on('keyup', $scope.keyPressed);

            elem.on("keyup", function (event) {
                if(event.which === 40) {
                    if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                        $scope.currentIndex ++;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                    $scope.$apply();
                } else if(event.which == 38) {
                    if ($scope.currentIndex >= 1) {
                        $scope.currentIndex --;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 13) {
                    if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                        $scope.selectResult($scope.results[$scope.currentIndex]);
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    } else {
                        $scope.results = [];
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 27) {
                    $scope.results = [];
                    $scope.showDropdown = false;
                    $scope.$apply();
                } else if (event.which == 8) {
                    $scope.selectedObject = null;
                    $scope.$apply();
                }
            });

        }
    };
});

var gillray = angular.module('gillray',['angucomplete']);
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
gillray.controller('index', ['$scope', 'prints', function($scope, prints) {
	
	
	$scope.prints = [];
	
	prints.getIndex().then(function(data) {
		
		$scope.prints = data
	})
	
	$scope.sortCritera = {
		date: null,
		title: null
	}
	
	$scope.$watchCollection('sortCritera', function(newVal, oldVal) {
		
		console.log($scope.sortCritera)
	});
}]);
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