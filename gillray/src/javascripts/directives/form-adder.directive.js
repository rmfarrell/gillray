gillray.directive('formAdder', function() {
	
	return {
		
		scope: {
			ngModel: "@",
			update: "&",
			eventType: "@"
		},
		
		link: function(scope, el, attrs) {
			
			el.on('blur', function(e) {
				
				el.prop('value', '');
			})
		}
	}
});