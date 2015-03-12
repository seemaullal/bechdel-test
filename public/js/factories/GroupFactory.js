app.factory('GroupFactory', function ($http) {
	return {
		getGroups: function(){
			return $http.get("/groups").then(function(response){
					return response.data;
				});
		}
	};
});