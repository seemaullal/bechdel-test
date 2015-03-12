var app = angular.module("Bechdel", []);

app.controller("MainController", function ($scope, scriptFactory){
	$scope.analyze = function(scriptString){
		// console.log(scriptFactory)
		scriptFactory.analyzeScript(scriptString);
	};
	$scope.genderize = function(scriptString){
		scriptFactory.characterizeGender(scriptString)
	}
	
});
