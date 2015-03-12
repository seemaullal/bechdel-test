app.directive("whogame", function(){
	console.log("whogame is triggered")
	return {
		restrict: 'E',
		templateUrl: 'js/directives/whogame/whogame.html'
	};
});