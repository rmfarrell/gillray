gillray.directive('formAdder', function() {
	
	return {
		
		scope: {
			ngModel: "@",
			update: "&",
			eventType: "@"
		},
		
		link: function(scope, el, attrs) {
			
			el.on(scope.eventType, function(e) {
				
				console.log(el.prop('value'))
				
				scope.update();
				
				el.prop('value', '');
			})
		}
	}
});