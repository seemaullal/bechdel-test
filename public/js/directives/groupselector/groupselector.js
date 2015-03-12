app.directive("groupselector", function(){
	console.log("groupselector is getting called right now")
	return {
		restrict: 'E',
		templateUrl: 'js/directives/groupselector/groupselector.html'
	};
});